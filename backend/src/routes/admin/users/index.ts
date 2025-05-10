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
  const user = await prisma.user.findUnique({
    where: {
      id: req.session.userId,
    },
    select: {
      districtAdminId: true,
    }
  });
  const districtId = user?.districtAdminId;

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
          },
          locked: true,
        }
      },
      teamAccepted: true,
    },
    where: (districtId === null ? undefined : {
      OR: [
        {
          teamId: null,
        },
        {
          team: {
            districtId: districtId,
          }
        }
      ]
    })
  });

  res.status(200).json(users.map(u => {return {...u, activated: (u.activationKey === null), activationKey: undefined}})).end();
});

router.patch('/activate/:userId', async (req: Request, res: Response) => {
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

router.get('/admins/:role(TOPLEVEL_COORDINATOR|ADMIN)', async (req: Request, res: Response) => {
  const role = req.params.role as "TOPLEVEL_COORDINATOR"|"ADMIN";

  if((role === "ADMIN" && req.session.userRole !== "ADMIN")
  || (role === "TOPLEVEL_COORDINATOR" && (req.session.userRole !== "TOPLEVEL_COORDINATOR" && req.session.userRole !== "ADMIN"))){
    res.status(403).json({ status: "error", message: "you dont have permission to do that" });
    return;
  }

  const users = await prisma.user.findMany({
    where: {
      role: role,
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
      lastLogin: true,
    }
  });

  res.status(200).json(users);
});

router.patch('/:userId(\\d+)/permissions/:role(USER|DISTRICT_COORDINATOR|TOPLEVEL_COORDINATOR|ADMIN)/:districtId(\\d+)?', async (req: Request, res: Response) => {
  const role = req.params.role as "USER"|"DISTRICT_COORDINATOR"|"TOPLEVEL_COORDINATOR"|"ADMIN";
  const districtId = Number.parseInt(req.params.districtId);
  if(role === "DISTRICT_COORDINATOR" && Number.isNaN(districtId)){
    res.status(400).json({ status: "error", message: "invalid district id" });
    return;
  }

  if((role === "ADMIN" && req.session.userRole !== "ADMIN")
  || (role === "TOPLEVEL_COORDINATOR" && (req.session.userRole !== "TOPLEVEL_COORDINATOR" && req.session.userRole !== "ADMIN"))
  || (role === "DISTRICT_COORDINATOR" && (!(req.session.userRole === "DISTRICT_COORDINATOR" && req.session.userDistrictAdmin?.id === districtId) && req.session.userRole !== "TOPLEVEL_COORDINATOR" && req.session.userRole !== "ADMIN"))){
    res.status(403).json({ status: "error", message: "you dont have permission to do that" });
    return;
  }

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
      role: role,
      districtAdminId: (role === "DISTRICT_COORDINATOR") ? districtId : null,
    },
    where: {
      id: userId,
    },
  });

  res.status(204).end();
});

export default router;