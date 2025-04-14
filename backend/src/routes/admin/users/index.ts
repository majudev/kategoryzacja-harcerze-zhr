import { Router, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get('/shallow', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
    }
  });

  res.status(200).json(users).end();
});

router.get('/', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      activationKey: true,
      createdAt: true,
      lastLogin: true,

      role: true,
      districtAdminId: true,
      districtAdmin: {
        select: {
          name: true,
        }
      },

      teamId: true,
      team: {
        select: {
          name: true,
          district: {
            select: {
              name: true,
            }
          }
        }
      },
      teamAccepted: true,
    }
  });

  res.status(200).json(users.map(u => {return {...u, activated: (u.activationKey === null), activationKey: undefined}})).end();
});

router.patch('/activate/:teamId', async (req: Request, res: Response) => {
  const userId = Number.parseInt(req.params.userId);
  if(Number.isNaN(userId)){
    res.status(400).json({ status: "error", message: "invalid user id" });
    return;
  }

  const userExists = await prisma.user.count({
    where: {
      id: userId,
    }
  }) > 0;
  if(!userExists){
    res.status(404).json({ status: "error", message: "user not found" });
    return;
  }

  // Grant permissions
  await prisma.user.update({
    data: {
      activationKey: null,
    },
    where: {
      id: userId,
    },
  });

  res.status(204).end();
});

/*router.get('/:districtId?', async (req: Request, res: Response) => {
  let districtId = undefined;
  if(!Number.isNaN(Number.parseInt(req.params.districtId))){
    districtId = Number.parseInt(req.params.districtId);
  }else if(req.session.userRole === "DISTRICT_COORDINATOR") districtId = req.session.userDistrictAdmin?.id;

  const districts = await prisma.district.findMany({
    where: {
      id: districtId,
    },
    select: {
      id: true,
      name: true,
      admins: {
        select: {
          id: true,
          email: true,
          lastLogin: true,
          createdAt: true,
        }
      },
      autoaccept: true,
      shadow: true,
      teams: {
        select: {
          id: true,
          name: true,
          createdAt: true,
          shadow: true,
          owners: {
            select: {
              id: true,
              email: true,
              lastLogin: true,
              createdAt: true,
              teamAccepted: true,
            }
          }
        }
      }
    },
    orderBy: {
      name: "asc",
    }
  });

  if(!Number.isNaN(Number.parseInt(req.params.districtId))){
    if(districts.length > 0) res.status(200).json(districts[0]).end();
    else res.status(404).end();
    return;
  }
  res.status(200).json(districts).end();
});

router.post('/', async (req: Request, res: Response) => {
  let { name, shadow, districtId } = req.body;

  if (!name || typeof name !== 'string' || districtId === undefined || typeof districtId !== 'number') {
      res.status(400).json({ status: "error", message: "name and districtId required" });
      return;
  }
  if(shadow === undefined || typeof shadow !== 'boolean') shadow = false;

  // Only ADMIN and TOPLEVEL can do this, DISTRICT can manage only their own district
  if(req.session.userRole !== "TOPLEVEL_COORDINATOR" && req.session.userRole !== "ADMIN"){
    if(districtId !== req.session.userDistrictAdmin?.id){
      res.status(403).json({ message: "Forbidden" });
      return;
    }
  }

  const team = await prisma.team.create({
    data: {
      name: name,
      shadow: shadow,
      districtId: districtId,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      shadow: true,
      owners: {
        select: {
          id: true,
          email: true,
          lastLogin: true,
          createdAt: true,
          teamAccepted: true,
        }
      }
    }
  });

  res.status(200).json(team).end();
});

router.patch('/:teamId', async (req: Request, res: Response) => {
  let { name, shadow, districtId } = req.body;

  if (((!name || typeof name !== 'string') && (districtId === undefined || typeof districtId !== 'number') && (typeof shadow !== 'boolean'))) {
    res.status(400).json({ status: "error", message: "patch body required" });
    return;
  }

  const teamId = Number.parseInt(req.params.teamId);
  if(Number.isNaN(teamId)){
    res.status(400).json({ status: "error", message: "invalid team id" });
    return;
  }

  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
    select: {
      districtId: true,
    }
  });
  if(team === null){
    res.status(404).json({ status: "error", message: "team not found" });
    return;
  }

  // Only ADMIN and TOPLEVEL can do this, DISTRICT can manage only their own district
  if(req.session.userRole !== "TOPLEVEL_COORDINATOR" && req.session.userRole !== "ADMIN"){
    if(team.districtId !== req.session.userDistrictAdmin?.id){
      res.status(403).json({ message: "Forbidden" });
      return;
    }
  }

  const updatedTeam = await prisma.team.update({
    data: {
      name: name,
      shadow: shadow,
      districtId: districtId,
    },
    where: {
      id: teamId,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      shadow: true,
      owners: {
        select: {
          id: true,
          email: true,
          lastLogin: true,
          createdAt: true,
          teamAccepted: true,
        }
      }
    }
  });

  res.status(200).json(updatedTeam).end();
});

router.get('/:action(grant|revoke)/:userId/on/:teamId', async (req: Request, res: Response) => {
  const action = req.params.action as "grant" | "revoke";

  const teamId = Number.parseInt(req.params.teamId);
  if(Number.isNaN(teamId)){
    res.status(400).json({ status: "error", message: "invalid team id" });
    return;
  }

  const userId = Number.parseInt(req.params.userId);
  if(Number.isNaN(userId)){
    res.status(400).json({ status: "error", message: "invalid user id" });
    return;
  }

  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
    select: {
      districtId: true,
    }
  });
  if(team === null){
    res.status(404).json({ status: "error", message: "team not found" });
    return;
  }

  const userExists = await prisma.user.count({
    where: {
      id: userId,
    }
  }) > 0;
  if(!userExists){
    res.status(404).json({ status: "error", message: "user not found" });
    return;
  }

  // Only ADMIN and TOPLEVEL can do this, DISTRICT can manage only their own district
  if(req.session.userRole !== "TOPLEVEL_COORDINATOR" && req.session.userRole !== "ADMIN"){
    if(team.districtId !== req.session.userDistrictAdmin?.id){
      res.status(403).json({ message: "Forbidden" });
      return;
    }
  }

  if(action === "grant"){
    // Grant permissions
    await prisma.user.update({
      data: {
        teamId: teamId,
        teamAccepted: true,
      },
      where: {
        id: userId,
      },
    });
  }else{
    // Revoke permissions
    await prisma.user.update({
      data: {
        teamId: null,
        teamAccepted: false,
      },
      where: {
        id: userId,
      },
    });
  }

  res.status(204).end();
});*/

export default router;