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
          },
          locked: true,
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
  let { name, shadow, autoaccept } = req.body;

  if (!name || typeof name !== 'string') {
      res.status(400).json({ status: "error", message: "name is required" });
      return;
  }
  if(shadow === undefined || typeof shadow !== 'boolean') shadow = false;
  if(autoaccept === undefined || typeof autoaccept !== 'boolean') autoaccept = false;

  // Only ADMIN and TOPLEVEL can do this
  if(req.session.userRole !== "TOPLEVEL_COORDINATOR" && req.session.userRole !== "ADMIN"){
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const district = await prisma.district.create({
    data: {
      name: name,
      shadow: shadow,
      autoaccept: autoaccept,
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
          },
          locked: true,
        }
      }
    }
  });

  res.status(200).json(district).end();
});

router.patch('/:districtId', async (req: Request, res: Response) => {
  let { name, shadow, autoaccept } = req.body;

  if (((!name || typeof name !== 'string') && (typeof autoaccept !== 'boolean') && (typeof shadow !== 'boolean'))) {
    res.status(400).json({ status: "error", message: "patch body required" });
    return;
  }

  const districtId = Number.parseInt(req.params.districtId);
  if(Number.isNaN(districtId)){
    res.status(400).json({ status: "error", message: "invalid district id" });
    return;
  }

  // Only ADMIN and TOPLEVEL can do this, DISTRICT can manage only their own district
  if(req.session.userRole !== "TOPLEVEL_COORDINATOR" && req.session.userRole !== "ADMIN"){
    if(districtId !== req.session.userDistrictAdmin?.id){
      res.status(403).json({ message: "Forbidden" });
      return;
    }
  }

  const updatedDistrict = await prisma.district.update({
    data: {
      name: name,
      shadow: shadow,
      autoaccept: autoaccept,
    },
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
          },
          locked: true,
        }
      }
    }
  });

  res.status(200).json(updatedDistrict).end();
});

export default router;