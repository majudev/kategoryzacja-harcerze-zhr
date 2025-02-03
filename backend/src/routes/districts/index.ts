import { Router, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response) => {
    if(!req.session.userId){
        res.status(500).end();
        return;
    }

    const district = await prisma.district.findMany({
        where: {
            shadow: false,
        },
        select: {
            id: true,
            name: true,
            shadow: true,
        }
    });

    res.status(200).json(district);
})

export default router;