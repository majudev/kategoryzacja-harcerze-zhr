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
    if(categorizationYear === null){ // should never happen
      res.status(500).end();
      return;
    }

    res.status(200).json({
      ...categorizationYear,
      puszczanskaLesneThreshold: categorizationYear.puszczanskaLesnaThreshold,
      puszczanskaLesnaThreshold: undefined,
    });
});

export const getCategory = async (polowa: number, lesna: number, puszczanska: number, lesnaLesneThreshold: number, lesnaPuszczanskieThreshold: number, puszczanskaLesneThreshold: number, puszczanskaPuszczanskieThreshold: number) => {
  let category = 'POLOWA';

  const effectiveLesnaTokens = lesna + puszczanska;
  
  // First check for PUSZCZANSKA: both the effective count and the specific puszczanska threshold must be met.
  if (
    puszczanska >= puszczanskaPuszczanskieThreshold &&
    effectiveLesnaTokens - puszczanskaPuszczanskieThreshold >= puszczanskaLesneThreshold
  ) {
    category = 'PUSZCZANSKA';
  }
  // Next, check for LESNA category.
  else if (
    puszczanska >= lesnaPuszczanskieThreshold &&
    effectiveLesnaTokens - lesnaPuszczanskieThreshold >= lesnaLesneThreshold
  ) {
    category = 'LESNA';
  }

  let nextCategory = 'LESNA';
  if (category === 'LESNA') nextCategory = 'PUSZCZANSKA';

  let requiredEffective = 0;
  let requiredPuszczanska = 0;
  
  if (nextCategory === 'LESNA') {
    requiredEffective = lesnaLesneThreshold;
    requiredPuszczanska = lesnaPuszczanskieThreshold;
  } else if (nextCategory === 'PUSZCZANSKA') {
    requiredEffective = puszczanskaLesneThreshold;
    requiredPuszczanska = puszczanskaPuszczanskieThreshold;
  }
  
  // Determine shortage in PUSZCZANSKA tokens.
  const missingPuszczanska = Math.max(0, requiredPuszczanska - puszczanska);
  
  // Adding missing PUSZCZANSKA tokens increases the effective count.
  const effectiveAfterPuszczanska = Math.max(0, effectiveLesnaTokens - missingPuszczanska);
  
  // Determine any remaining shortage in the effective token count.
  const missingEffective = Math.max(0, requiredEffective - effectiveAfterPuszczanska);

  return {
    category,
    nextCategory,
    tokens: {
      polowa: polowa,
      lesna: lesna,
      puszczanska: puszczanska,
    },
    missingTokens: {
      lesna: missingEffective,
      puszczanska: missingPuszczanska,
    }
  };
};

router.get('/category', async (req: Request, res: Response) => {
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
  if(categorizationYear === null){ // should never happen
    res.status(500).end();
    return;
  }

  const tasks = await getTasks(teamId, 1);  ///TODO: de-hardcode categorizationYearId

  const polowa = tasks.filter((taskGroup) => taskGroup.achievedSymbol === 'POLOWA').length;
  const lesna = tasks.filter((taskGroup) => taskGroup.achievedSymbol === 'LESNA').length;
  const puszczanska = tasks.filter((taskGroup) => taskGroup.achievedSymbol === 'PUSZCZANSKA').length;

  const result = await getCategory(polowa, lesna, puszczanska, categorizationYear.lesnaLesneThreshold, categorizationYear.lesnaPuszczanskieThreshold, categorizationYear.puszczanskaLesnaThreshold, categorizationYear.puszczanskaPuszczanskieThreshold);

  res.status(200).json(result);
});

export default router;