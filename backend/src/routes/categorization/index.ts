import { Router, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
import { getTasks } from "../tasks";

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response) => {
    const categorizationYear = await prisma.categorizationYear.findUnique({
      where: {
        id: 1, ///TODO: de-hardcode this
      },
      select: {
        id: true,
        name: true,

        lesnaLesneThreshold: true,
        lesnaPuszczanskieThreshold: true,
        puszczanskaLesnaThreshold: true,
        puszczanskaPuszczanskieThreshold: true,
      }
    });

    res.status(200).json(categorizationYear);
});

/*router.get('/category', async (req: Request, res: Response) => {
  if(!req.session.userId){
    res.status(500).end();
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
        id: req.session.userId,
    },
    select: {
        teamId: true,
        teamAccepted: true,
    }
  });
  if(!user){ // should never happen
      res.status(500).end();
      return;
  }
  if(user.teamId === null){
    res.status(404).json({ message: "you have not yet registered your team" });
    return;
  }
  if(!user.teamAccepted){
      res.status(403).json({ message: "you don't have permission to view this team" });
      return;
  }
  const teamId = user.teamId;

  const categorizationYear = await prisma.categorizationYear.findUnique({
    where: {
      id: 1, ///TODO: de-hardcode this
    },
    select: {
      id: true,
      name: true,

      lesnaLesneThreshold: true,
      lesnaPuszczanskieThreshold: true,
      puszczanskaLesnaThreshold: true,
      puszczanskaPuszczanskieThreshold: true,
    }
  });

  const tasks = await getTasks(teamId, 1);  ///TODO: de-hardcode categorizationYearId



  res.status(200).json(categorizationYear);
});*/

export default router;