import { Router, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
import { getRanking } from "../../utils/rankingbuilder";
import { getCategorizationYearId } from "../categorization/year";

const router = Router();
const prisma = new PrismaClient();

router.get('/:yearId?', async (req: Request, res: Response) => {
  let yearId = Number.parseInt(req.params.yearId);

  if(isNaN(yearId)){
    const categorizationYearId = await getCategorizationYearId();
    if(categorizationYearId === null){
      const year = await prisma.categorizationYear.findMany({
          where: {
              state: "FINISHED",
          },
          select: {
              id: true,
          },
          orderBy: {
            createdAt: "asc",
          }
      });
      if(year.length < 1){
        res.status(404).json({ message: "no categorizations in the system" }).end();
        return;
      }
      yearId = year[0].id;
    }else yearId = categorizationYearId;
  }

  const rankingString = await getRanking(yearId);
  const rankingJSON = JSON.parse(rankingString);

  res.status(200).json(rankingJSON);
});

export default router;