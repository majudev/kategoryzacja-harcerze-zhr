import { Router, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

/*router.get('/', async (req: Request, res: Response) => {
    if(!req.session.userId){
        res.status(500).end();
        return;
    }

    const teams = await prisma.team.findMany({
        where: {
            shadow: false,
        },
        select: {
            id: true,
            name: true,
            shadow: true,
        }
    });

    res.status(200).json(teams);
});*/

router.post('/', async (req: Request, res: Response) => {
    const {name, districtId} = req.body;
    if(typeof districtId !== 'number' || !Number.isInteger(districtId)){
        res.status(400).json({ message: "district id must be an integer" });
        return;
    }
    if(typeof name !== 'string'){
        res.status(400).json({ message: "team name must be a string" });
        return;
    }
    
    if(!req.session.userId){
        res.status(500).end();
        return;
    }

    if(await prisma.team.count({where: {name: name}}) > 0){
        res.status(422).json({ message: "team with this name already exists" });
        return;
    }

    const district = await prisma.district.findUnique({
        where: {
            id: districtId,
        }
    });

    if(district === null){
        res.status(404).json({ message: "district not found" });
        return;
    }

    const team = await prisma.$transaction(async (tx) => {
        // We first update the acceptation to prevent doubling of the select query
        await tx.user.update({
            where: {
                id: req.session.userId
            },
            data: {
              teamAccepted: district.autoaccept,
            }
        });
        return await tx.team.create({
            data: {
                name: name,
                districtId: districtId,
                owners: {
                    connect: {
                        id: req.session.userId 
                    }
                }
            },
            select: {
                id: true,
                name: true,
                shadow: true,
                owners: {
                    select: {
                        id: true,
                        teamAccepted: true,
                    }
                },
                districtId: true,
            }
        });
    });

    res.status(200).json(team);
});

router.get('/by-district-id/:districtId', async (req: Request, res: Response) => {
    const districtId = Number.parseInt(req.params.districtId);

    if(isNaN(districtId)){
        res.status(400).json({ message: "district id must be an integer" });
        return;
    }

    if(!req.session.userId){
        res.status(500).end();
        return;
    }

    const teams = await prisma.team.findMany({
        where: {
            districtId: districtId,
        },
        select: {
            id: true,
            name: true,
            shadow: true,
        }
    });

    res.status(200).json(teams);
});

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
            team: {
                select: {
                    id: true,
                    name: true,

                    createdAt: true,
                    
                    districtId: true,
                    district: {
                        select: {
                            id: true,
                            name: true,
                        }
                    },

                    shadow: true,

                    owners: {
                        select: {
                            email: true,
                        }
                    }
                }
            },
            teamAccepted: true,
        }
    });
    if(!user){ // should never happen
        res.status(500).end();
        return;
    }

    if(user.team === null){
        res.status(404).json({ message: "you have not yet registered your team" });
        return;
    }

    if(!user.teamAccepted){
        res.status(403).json({ message: "you don't have permission to view this team" });
        return;
    }

    res.status(200).json(user.team);
});

export default router;