import { Router, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

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
      const tasks = await tx.initialTask.findMany({
        where: {
          categorizationYearId: 1, ///TODO: de-hardcode this
        },
        select: {
          id: true,
          name: true,

          displayPriority: true,
        },
        orderBy: {
          name: 'desc',
        }
      });

      const finishedTasks = await tx.initialTaskJoint.findMany({
        where: {
          teamId: teamId,
        },
        select: {
          taskId: true,

          value: true,
        }
      });

      const populatedTasks = tasks.map((task) => {
        const joint = finishedTasks.find((joint) => {return joint.taskId === task.id});

        return {
          ...task,
          value: (joint !== undefined ? joint.value : false),
          displayPriority: undefined,
        };
      });

      return populatedTasks.sort((a, b) => (a.displayPriority !== b.displayPriority) ? (a.displayPriority - b.displayPriority) : a.name.localeCompare(b.name));
    });

    res.status(200).json(tasks);
});

router.post('/:action(mark|unmark)/:taskId', async (req: Request, res: Response) => {
  const taskId = Number.parseInt(req.params.taskId);
  const value = req.params.action === 'mark';

  if(isNaN(taskId)){
    res.status(400).json({ message: "initial task id must be an integer" });
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

  await prisma.initialTaskJoint.upsert({
    create: {
      taskId: taskId,
      teamId: teamId,
      value: value,
    },
    update: {
      value: value,
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