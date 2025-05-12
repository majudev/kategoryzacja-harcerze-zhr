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

router.post('/', async (req: Request, res: Response) => {
  let { name, sourceId } = req.body;

  if ((!name || typeof name !== 'string')
   || (sourceId !== undefined && typeof sourceId !== 'number')) {
    res.status(400).json({ status: "error", message: "body required" });
    return;
  }

  // Only ADMIN and TOPLEVEL can do this
  if(req.session.userRole !== "TOPLEVEL_COORDINATOR" && req.session.userRole !== "ADMIN"){
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  if(sourceId === undefined){
    await prisma.categorizationYear.create({
      data: {
        name: name,
      }
    });

    res.status(204).end();
    return;
  }

  // Extract data of the original object
  const orig = await prisma.categorizationYear.findUnique({
    where: { 
      id: sourceId,
    },
    include: {
      initialTasks: true,
      taskGroup: {
        include: {
          primaryTasks: {
            include: { 
              refVals: true,
            },
          },
          secondaryTasks: {
            include: {
              refVals: true,
            },
          },
        },
      },
    },
  });
  if(!orig){
    res.status(404).json({ message: "no such categorization year exists" });
    return;
  }

  await prisma.$transaction(async (tx) => {
    // Create new year with DRAFT state, omit ranking, make sure yearScalars contains only scalars
    const {
      id: _oldId,
      createdAt: _oldCreatedAt,
      state: _oldState,
      initialTasks: origInitialTasks,
      taskGroup: origTaskGroups,
      ...yearScalars                // this now contains only name, thresholds, etc.
    } = orig;

    // 3. Create the new year with only scalars + forced DRAFT state
    const newYear = await tx.categorizationYear.create({
      data: {
        ...yearScalars,
        state: 'DRAFT',
        name: name,
      },
    });

    // 4. Clone task groups
    const groupMap = new Map<number, number>();
    for (const grp of origTaskGroups) {
      // Destructure away the relational arrays primaryTasks & secondaryTasks
      const {
        id: oldGid,
        categorizationYearId,
        primaryTasks,        // ← remove this
        secondaryTasks,      // ← and this
        ...grpScalars        // now contains only name, thresholds, etc.
      } = grp;

      const newGrp = await tx.categorizationTaskGroup.create({
        data: {
          ...grpScalars,
          categorizationYear: { connect: { id: newYear.id } },
        },
      });
      groupMap.set(oldGid, newGrp.id);
    }

    const taskMap = new Map<number, number>();
    const allTasks = [
      ...orig.taskGroup.flatMap(g => g.primaryTasks),
      ...orig.taskGroup.flatMap(g => g.secondaryTasks),
    ];
    for (const t of allTasks) {
      const {
        id: oldTid,
        primaryGroupId,
        secondaryGroupId,
        refValId,
        refVals,
        ...tData
      } = t;

      const newTask = await tx.categorizationTask.create({
        data: {
          ...tData,
          primaryGroup: { connect: { id: groupMap.get(primaryGroupId)! } },
          ...(secondaryGroupId
            ? { secondaryGroup: { connect: { id: groupMap.get(secondaryGroupId)! } } }
            : {}),
        },
      });
      taskMap.set(oldTid, newTask.id);
    }

    for (const t of allTasks) {
      if (t.refValId) {
        const newId = taskMap.get(t.id)!;
        const newRef = taskMap.get(t.refValId);
        if (newRef) {
          await tx.categorizationTask.update({
            where: { id: newId },
            data: { refVal: { connect: { id: newRef } } },
          });
        }
      }
    }

    for (const it of orig.initialTasks) {
      const { id: oldIt, categorizationYearId, ...itData } = it;
      await tx.initialTask.create({
        data: {
          ...itData,
          categorizationYear: { connect: { id: newYear.id } },
        },
      });
    }
  });

  res.status(204).end();
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

router.delete('/:categorizationYearId(\\d+)', async (req: Request, res: Response) => {
  const categorizationYearId = Number.parseInt(req.params.categorizationYearId);

  // Only ADMIN and TOPLEVEL can do this
  if(req.session.userRole !== "TOPLEVEL_COORDINATOR" && req.session.userRole !== "ADMIN"){
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const catYear = await prisma.categorizationYear.findUnique({
    where: {
      id: categorizationYearId,
    },
    select: {
      id: true,
      state: true,

      initialTasks: {
        select: {
          id: true,
          joints: {
            select: {
              taskId: true,
              teamId: true,
            }
          }
        }
      },
      taskGroup: {
        select: {
          primaryTasks: {
            select: {
              id: true,
              joints: {
                select: {
                  taskId: true,
                  teamId: true,
                }
              }
            }
          },
          secondaryTasks: {
            select: {
              id: true,
              joints: {
                select: {
                  taskId: true,
                  teamId: true,
                }
              }
            }
          }
        }
      },
    }
  });
  if(catYear === null){
    res.status(404).json({ message: "no such categorization year exists" });
    return;
  }
  if(catYear.state !== "DRAFT"){
    res.status(404).json({ message: "you can delete only in draft state" });
    return;
  }

  await prisma.$transaction(async (tx) => {
    // Remove initial tasks
    const initialJointsToDelete = catYear.initialTasks
      .flatMap((task) => task.joints)
      .map((joint) => ({
        taskId: joint.taskId,
        teamId: joint.teamId,
      }));

    const initialTasksToDelete = catYear.initialTasks
      .map((task) => ({
        id: task.id,
      }));

    if(initialJointsToDelete) await tx.initialTaskJoint.deleteMany({
      where: {
        OR: initialJointsToDelete,
      },
    });

    if(initialTasksToDelete) await tx.initialTask.deleteMany({
      where: {
        OR: initialTasksToDelete,
      },
    });

    // Remove tasks
    const allTasks = [
      ...catYear.taskGroup.flatMap((group) => group.primaryTasks),
      ...catYear.taskGroup.flatMap((group) => group.secondaryTasks),
    ];
  
    const taskJoints = allTasks
      .flatMap((t) => t.joints)
      .map(({ taskId, teamId }) => ({ taskId, teamId }));
    if (taskJoints.length) {
      await tx.taskJoint.deleteMany({
        where: {
          OR: taskJoints,
        },
      });
    }
  
    const tasks = allTasks.map((t) => ({ id: t.id }));
    if (tasks.length) {
      await tx.categorizationTask.deleteMany({
        where: {
          OR: tasks,
        },
      });
    }
  
    // Remove task groups
    await tx.categorizationTaskGroup.deleteMany({
      where: {
        categorizationYearId: catYear.id,
      },
    });

    // Remove ranking
    await tx.ranking.deleteMany({
      where: {
        categorizationYearId: catYear.id
      },
    });
  
    // Remove ranking
    await tx.categorizationYear.delete({
      where: {
        id: catYear.id,
      },
    });
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