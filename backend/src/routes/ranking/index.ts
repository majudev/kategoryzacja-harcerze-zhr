import { Router, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
import { getRanking } from "../../utils/rankingbuilder";

const router = Router();
const prisma = new PrismaClient();

router.get('/:yearId?', async (req: Request, res: Response) => {
  let yearId = Number.parseInt(req.params.yearId);

  if(isNaN(yearId)){
    yearId = 1; ///TODO: de-hardcode this
  }

  const rankingString = await getRanking(yearId);
  const rankingJSON = JSON.parse(rankingString);

  res.status(200).json(rankingJSON);
});

export default router;