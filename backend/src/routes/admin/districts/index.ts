import { Router, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get('/shallow', async (req: Request, res: Response) => {
  let districtId = undefined;
  if(req.session.userRole === "DISTRICT_COORDINATOR") districtId = req.session.userDistrictAdmin?.id;

  const districts = await prisma.district.findMany({
    where: {
      id: districtId,
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    }
  });

  res.status(200).json(districts).end();
});

router.get('/:districtId?', async (req: Request, res: Response) => {
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

export default router;