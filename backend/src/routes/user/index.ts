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
                    id: true,
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
            teamAccepted: true,
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
});

router.patch('/grant-team-access/:userId', async (req: Request, res: Response) => {
    const userId = Number.parseInt(req.params.userId);

    if(isNaN(userId)){
        res.status(400).json({ message: "user id must be an integer" });
        return;
    }

    const me = await prisma.user.findUnique({
        where: {
            id: req.session.userId as number,
        },
        select: {
            teamId: true,
            teamAccepted: true,
        },
    });

    const target = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            teamId: true,
        },
    });

    if(me === null || !me.teamAccepted || me.teamId === null || target === null || target.teamId !== me.teamId){
        res.status(403).json({ message: "you don't have permissions to do this" });
        return;
    }

    await prisma.user.update({
        data: {
            teamAccepted: true,
        },
        where: {
            id: userId,
        }
    });

    res.status(204).end();
});

export default router;