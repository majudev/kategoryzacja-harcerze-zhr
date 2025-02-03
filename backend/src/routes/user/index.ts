import { Router, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response) => {
    if(!req.session.userId){
        res.status(500).end();
        return;
    }

    const user = await prisma.user.findUnique({
        where: {
            id: req.session.userId,
        },
        select: {
            id: true,
            email: true,
            activationKey: true,
            createdAt: true,
            lastLogin: true,

            role: true,
            districtAdmin: {
                select: {
                    id: true,
                    name: true,
                }
            },

            team: {
                select: {
                    team: {
                        select: {
                            name: true,
                            createdAt: true,
                            district: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            },
                            shadow: true,
                        }
                    },
                    accepted: true,
                }
            }
        }
    });

    if(user === null){
        res.status(404).json({ message: "user not found" });
        return;
    }

    res.status(200).json({
        ...user,
        activationKey: undefined,
        activated: user.activationKey === null,
    });
})

export default router;