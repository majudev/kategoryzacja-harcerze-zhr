import { Router, Request, Response } from "express";

import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import svgCaptcha from "svg-captcha";

const router = Router();
const prisma = new PrismaClient();

// User Registration
router.get("/captcha", (req: Request, res: Response) => {
    const captcha = svgCaptcha.create({
        size: 6, // Number of characters
        noise: 2, // Add noise for difficulty
        color: true, // Colored text
        background: "#f7f7f7", // Light background
    });

    req.session.captcha = captcha.text; // Store CAPTCHA text in session

    res.type("svg"); // Send response as an SVG image
    res.status(200).send(captcha.data);
});
router.post("/register", async (req: Request, res: Response) => {
    const { email, password, captcha } = req.body;

    if (!email || !password || !captcha) {
        res.status(400).json({ status: "error", message: "Email, password and captcha are required" });
        return;
    }
    if (req.session.captcha !== captcha){
        req.session.captcha = undefined;
        res.status(400).json({ status: "error", message: "Wrong captcha" });
        return;
    }
    req.session.captcha = undefined;

    const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS || 14));

    try {
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            },
            select: {
                email: true,
                activationKey: true,
            }
        });

        // Placeholder for sending confirmation email
        console.log("Send email confirmation to:", user.email, " - key ", user.activationKey);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
});

// User Login
router.post("/login", async (req: Request, res: Response) => {
    const { email, password, captcha } = req.body;

    if (!email || !password || !captcha) {
        res.status(400).json({ status: "error", message: "Email, password and captcha are required" });
        return;
    }

    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
        select: {
            id: true,
            email: true,
            password: true,
            activationKey: true,

            role: true,
            districtAdmin: true,
        }
    });

    if (!user || user.activationKey !== null) {
        res.status(401).json({ message: "User not activated" });
        return;
    }
    if (!(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }

    req.session.authenticated = true;
    req.session.userId = user.id;
    req.session.userRole = user.role;
    req.session.userDistrictAdmin = user.districtAdmin;

    await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() }
    });
    res.json({ message: "Login successful" });
});

// Logout
router.get("/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: "Error logging out" });
        res.json({ message: "Logout successful" });
    });
});

// Password Reset (Dummy)
/*router.post("/reset-password", async (req: Request, res: Response) => {
    const { email, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 14);

    await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
    });

    res.json({ message: "Password reset successful" });
});*/

router.post("/activate/:key", async (req: Request, res: Response) => {
    const activationKey = req.params.key;

    const user = await prisma.user.findUnique({
        where: { 
            activationKey: activationKey,
        }
    });

    if(!user){
        res.status(401).json({ message: "Wrong activation key" });
    }

    await prisma.user.update({
        data: {
            activationKey: null,
        },
        where: {
            activationKey: activationKey,
        }
    });

    res.status(201).end();
});

export default router;
