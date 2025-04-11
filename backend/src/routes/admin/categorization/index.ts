import { Router, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get('/shallow', async (req: Request, res: Response) => {
  const catYears = await prisma.categorizationYear.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
      state: true,
    },
    orderBy: {
      createdAt: "desc",
    }
  });

  res.status(200).json(catYears);
});

export default router;