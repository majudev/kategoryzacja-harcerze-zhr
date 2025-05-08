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

    // Create the team
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
                        email: true,
                        teamAccepted: true,
                    }
                },
                districtId: true,
            }
        });
    });

    // Send notification to district coordinators
    const notificationText = district.autoaccept ? 
        "Użytkownik " + team.owners[0].email + " utworzył w twojej chorągwi drużynę " + team.name + " i została ona automatycznie zatwierdzona."
        :
        "Użytkownik " + team.owners[0].email + " utworzył w twojej chorągwi drużynę " + team.name + ". Aby zaakceptować ją lub usunąć, przejdź do panelu administratora.";
    const district_coordinators = await prisma.user.findMany({
        where: {
            districtAdminId: team.districtId,
        },
        select: {
            id: true,
        }
    });
    district_coordinators.length > 0 && await prisma.notification.createMany({
        data: district_coordinators.map(coordinator => {
            return {
                userId: coordinator.id,
                text: notificationText,
            }
        })
    });

    await prisma.notification.create({
        data: {
            userId: req.session.userId,
            text: "Utworzyłeś w systemie drużynę " + team.name,
        }
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

router.patch('/grant/:userId', async (req: Request, res: Response) => {
  const userId = Number.parseInt(req.params.userId);
  if(Number.isNaN(userId)){
    res.status(400).json({ status: "error", message: "invalid user id" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
        id: req.session.userId,
    },
    select: {
        teamId: true,
        teamAccepted: true,
        team: {
            select: {
                name: true,
            }
        }
    }
  });

  if(user === null){ // Should never happen
    res.status(500).json({ status: "error", message: "user not found" });
    return;
  }

  if(user.teamId === null || user.team === null || !user.teamAccepted){
    res.status(404).json({ status: "error", message: "team not found" });
    return;
  }

  // Grant permissions
  await prisma.user.updateMany({
    data: {
      teamAccepted: true,
    },
    where: {
      id: userId,
      teamId: user.teamId,
    },
  });
  await prisma.notification.create({
    data: {
        userId: userId,
        text: "Dostałeś uprawnienia do drużyny " + user.team.name + ".",
    }
  });
  ///TODO: send e-mail

  res.status(204).end();
});

router.get('/ask-access/:teamId', async (req: Request, res: Response) => {
    const teamId = Number.parseInt(req.params.teamId);
    if(Number.isNaN(teamId)){
      res.status(400).json({ status: "error", message: "invalid team id" });
      return;
    }

    const user = await prisma.user.findUnique({
        where: {
            id: req.session.userId,
        },
        select: {
            id: true,
            email: true,
        }
    });
    if(user === null){ //Should never happen
      res.status(500).json({ status: "error", message: "user not found" });
      return;
    }
  
    const team = await prisma.team.findUnique({
      where: {
          id: teamId,
      },
      select: {
          id: true,
          name: true,
          owners: {
            select: {
                id: true,
                teamAccepted: true,
            }
          },
          district: {
            select: {
                admins: {
                    select: {
                        id: true,
                    }
                }
            }
          },
          shadow: true,
      }
    });
  
    if(team === null || team.shadow){
      res.status(404).json({ status: "error", message: "team not found" });
      return;
    }
  
    // Grant permissions
    await prisma.user.updateMany({
      data: {
        teamId: teamId,
      },
      where: {
        id: req.session.userId,
      },
    });

    // Send notification with access request
    const userNotificationText = "Użytkownik " + user.email + " chce uzyskać dostęp do Twojej drużyny. [GRANT_ACCESS=" + user.id + "]";
    team.owners.length > 0 && await prisma.notification.createMany({
        data: team.owners.map(owner => {
            return {
                userId: owner.id,
                text: userNotificationText,
            }
        })
    });
    ///TODO: send e-mail

    // Send notification to district coordinators
    /*const coordinatorNotificationText = "Użytkownik " + user.email + " chce uzyskać dostęp do drużyny " + team.name + ". [GRANT_ACCESS=" + user.id + "]";
    team.district.admins.length > 0 && await prisma.notification.createMany({
        data: team.district.admins.map(coordinator => {
            return {
                userId: coordinator.id,
                text: coordinatorNotificationText,
            }
        })
    });*/

    res.status(204).end();
  });

export default router;