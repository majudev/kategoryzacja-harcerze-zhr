import { Router, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
import initialRouter from "./initial";
import tasksRouter from "./tasks";
import stateRouter from "./stateman";
import { getTasks } from "../../tasks";
import { getCategory } from "../../categorization";

const router = Router();
const prisma = new PrismaClient();

router.use('/initial', initialRouter);
router.use('/tasks', tasksRouter);
router.use('/state', stateRouter);

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

router.get('/:categorizationYearId(\\d+)', async (req: Request, res: Response) => {
  const categorizationYearId = Number.parseInt(req.params.categorizationYearId);

  const categorizationYear = await prisma.categorizationYear.findUnique({
    where: {
      id: categorizationYearId,
    },
    select: {
      id: true,
      name: true,
      state: true,
      createdAt: true,

      lesnaLesneThreshold: true,
      lesnaPuszczanskieThreshold: true,
      puszczanskaLesnaThreshold: true,
      puszczanskaPuszczanskieThreshold: true,

      initialTasks: {
        select: {
          id: true,
          name: true,
          description: true,
          
          displayPriority: true,
        },
        orderBy: [
          {
            displayPriority: "asc",
          },
          {
            name: "asc",
          }
        ]
      },

      taskGroup: {
        select: {
          id: true,
          name: true,
          
          primaryTasks: {
            select: {
              id: true,
              name: true,
              description: true,

              primaryGroup: {
                select: {
                  id: true,
                  name: true,
                }
              },
              secondaryGroup: {
                select: {
                  id: true,
                  name: true,
                }
              },
              split: true,

              type: true,

              maxPoints: true,
              multiplier: true,

              refValId: true,

              obligatory: true,
            },
          },

          lesnaThreshold: true,
          puszczanskaThreshold: true,

          displayPriority: true,
        },
        orderBy: [
          {
            displayPriority: "asc",
          },
          {
            name: "asc",
          }
        ]
      },

      ranking: true,
    }
  });

  if(categorizationYear === null){
    res.status(404).json({ message: "no such categorization year exists" });
    return;
  }

  res.status(200).json({
    ...categorizationYear,
    ranking: categorizationYear.ranking !== null,
  });
});

router.patch('/:categorizationYearId(\\d+)', async (req: Request, res: Response) => {
  const categorizationYearId = Number.parseInt(req.params.categorizationYearId);
  let { name, state, lesnaLesneThreshold, lesnaPuszczanskieThreshold, puszczanskaLesnaThreshold, puszczanskaPuszczanskieThreshold } = req.body;

  if ((!name || typeof name !== 'string') 
   && (state !== "OPEN" || state !== "DRAFT" || state !== "FINISHED")
   && (lesnaLesneThreshold === undefined || typeof lesnaLesneThreshold !== 'number')
   && (lesnaPuszczanskieThreshold === undefined || typeof lesnaPuszczanskieThreshold !== 'number')
   && (puszczanskaLesnaThreshold === undefined || typeof puszczanskaLesnaThreshold !== 'number')
   && (puszczanskaPuszczanskieThreshold === undefined || typeof puszczanskaPuszczanskieThreshold !== 'number')) {
    res.status(400).json({ status: "error", message: "patch body required" });
    return;
  }

  // Only ADMIN and TOPLEVEL can do this
  if(req.session.userRole !== "TOPLEVEL_COORDINATOR" && req.session.userRole !== "ADMIN"){
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const categorizationYearExists = await prisma.categorizationYear.count({
    where: {
      id: categorizationYearId,
    }
  }) > 0;
  if(!categorizationYearExists){
    res.status(404).json({ message: "no such categorization year exists" });
    return;
  }

  await prisma.categorizationYear.update({
    where: {
      id: categorizationYearId,
    },
    data: {
      name: name,
      lesnaLesneThreshold: lesnaLesneThreshold,
      lesnaPuszczanskieThreshold: lesnaPuszczanskieThreshold,
      puszczanskaLesnaThreshold: puszczanskaLesnaThreshold,
      puszczanskaPuszczanskieThreshold: puszczanskaPuszczanskieThreshold,
    },
    select: {
      id: true,
    }
  });

  res.status(204).end();
});

router.get('/list/:categorizationYearId(\\d+)', async (req: Request, res: Response) => {
  const categorizationYearId = Number.parseInt(req.params.categorizationYearId);

  const teams = await prisma.team.findMany({
    where: {
      shadow: false,
    },
    select: {
      id: true,
      name: true,
      district: {
        select: {
          id: true,
          name: true,
        }
      }
    },
    orderBy: [
      {
        district: {
          name: "asc",
        }
      },
      {
        name: "asc",
      }
    ]
  });

  const categorizationYear = await prisma.categorizationYear.findUnique({
    where: {
      id: categorizationYearId,
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

  const list = await Promise.all(teams.map(async (team) => {  
    const tasks = await getTasks(team.id, categorizationYearId);
  
    const polowa = tasks.filter((taskGroup) => taskGroup.achievedSymbol === 'POLOWA').length;
    const lesna = tasks.filter((taskGroup) => taskGroup.achievedSymbol === 'LESNA').length;
    const puszczanska = tasks.filter((taskGroup) => taskGroup.achievedSymbol === 'PUSZCZANSKA').length;
  
    const result = await getCategory(polowa, lesna, puszczanska, categorizationYear.lesnaLesneThreshold, categorizationYear.lesnaPuszczanskieThreshold, categorizationYear.puszczanskaLesnaThreshold, categorizationYear.puszczanskaPuszczanskieThreshold);

    return {
      ...team,
      ...result,
    }
  }));

  res.status(200).json(list);
});

export default router;