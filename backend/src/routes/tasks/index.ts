import { Router, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
import initialRouter from './initial';
import { calculateTaskScore } from "../../utils/taskcalc";

const router = Router();
const prisma = new PrismaClient();

router.use('/initial', initialRouter);

router.get('/', async (req: Request, res: Response) => {
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

    const tasks = await prisma.$transaction(async (tx) => {
      const taskGroups = await tx.categorizationTaskGroup.findMany({
        where: {
          categorizationYearId: 1, ///TODO: de-hardcode this
        },
        select: {
          id: true,
          name: true,

          primaryTasks: {
            select: {
              id: true,
              name: true,

              primaryGroupId: true,
              secondaryGroupId: true,
              split: true,

              type: true,
              multiplier: true,
              refValId: true,
            }
          },
          secondaryTasks: {
            select: {
              id: true,
              name: true,

              primaryGroupId: true,
              secondaryGroupId: true,
              split: true,

              type: true,
              multiplier: true,
              refValId: true,
            }
          }
        },
        orderBy: [
          {
            displayPriority: 'desc',
          },
          {
            name: 'desc',
          }
        ]
      });

      const finishedTasks = await tx.taskJoint.findMany({
        where: {
          teamId: teamId,
        },
        select: {
          taskId: true,

          value: true,
          favourite: true,
        }
      });

      const mergedTaskGroups = taskGroups.map(taskGroup => {
        const primaryTasks = taskGroup.primaryTasks;
        const secondaryTasks = taskGroup.secondaryTasks;
        const tasks = primaryTasks.concat(secondaryTasks);

        const populatedTasks = tasks.map((task) => {
          const joint = finishedTasks.find((joint) => {return joint.taskId === task.id});

          return {
            ...task,
            value: (joint !== undefined ? joint.value : null),
            favourite: (joint !== undefined ? joint.favourite : false),
            points: calculateTaskScore(),
          };
        });

        return {
          ...taskGroup,
          primaryTasks: undefined,
          secondaryTasks: undefined,
          tasks: populatedTasks,
        };
      });

      return mergedTaskGroups;
    });

    res.status(200).json(tasks);
});

router.post('/:action(select|deselect)/:taskId', async (req: Request, res: Response) => {
  const taskId = Number.parseInt(req.params.taskId);
  const favourite = req.params.action === 'select';

  if(isNaN(taskId)){
    res.status(400).json({ message: "task id must be an integer" });
    return;
  }

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

  await prisma.taskJoint.upsert({
    create: {
      taskId: taskId,
      teamId: teamId,
      favourite: favourite,
    },
    update: {
      favourite: favourite,
    },
    where: {
      taskId_teamId: {
        taskId: taskId,
        teamId: teamId
      }
    }
  });

  res.status(201).end();
});

export default router;