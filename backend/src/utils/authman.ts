import { Request, Response, NextFunction } from "express";

export const authman = (req: Request, res: Response, next: NextFunction) => {
    // Unprotected routes
    if (req.path.startsWith("/auth/")) {
        return next();
    }

    if (req.session.userId) {
        return next();
    }
    res.status(401).json({ message: "Unauthorized" });
};

export default authman;