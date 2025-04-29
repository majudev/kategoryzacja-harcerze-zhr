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
          }
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

export default router;