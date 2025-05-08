import { Router, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get('/:loadN(\\d+)?', async (req: Request, res: Response) => {
    const loadN = req.params.loadN ? parseInt(req.params.loadN, 10) : 10;

    if(!req.session.userId){
        res.status(500).end();
        return;
    }

    const notifications = await prisma.notification.findMany({
        where: {
            userId: req.session.userId,
        },
        take: loadN,
        select: {
            id: true,
            time: true,
            text: true,
            unread: true,
        },
        orderBy: {
            time: "desc",
        }
    });

    res.status(200).json(notifications);
});

router.patch('/read/:notificationId', async (req: Request, res: Response) => {
    const notificationId = Number.parseInt(req.params.notificationId);

    if(isNaN(notificationId)){
        res.status(400).json({ message: "notification id must be an integer" });
        return;
    }

    await prisma.notification.updateMany({
        where: {
            id: notificationId,
            userId: req.session.userId,
        },
        data: {
            unread: false,
        }
    });

    res.status(204).end();
});

router.patch('/:action(discard|accept)/:notificationId', async (req: Request, res: Response) => {
    const action = req.params.action as 'accept' | 'discard';
    const notificationId = Number.parseInt(req.params.notificationId);

    if(isNaN(notificationId)){
        res.status(400).json({ message: "notification id must be an integer" });
        return;
    }

    const notification = await prisma.notification.findFirst({
        where: {
            id: notificationId,
            userId: req.session.userId,
        },
        select: {
            text: true,
        }
    });

    if(notification === null){
        res.status(404).json({ message: "notification id not found" }).end();
        return;
    }

    const newText = notification.text.replace(/\[[^\]]+\]/g, action === 'accept' ? '(zaakceptowano)' : '(odrzucono)');

    await prisma.notification.update({
        where: {
            id: notificationId,
        },
        data: {
            text: newText,
        }
    });

    res.status(204).end();
});

export default router;