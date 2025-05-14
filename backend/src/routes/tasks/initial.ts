import { Router, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
import { getCategorizationYearId } from "../categorization/year";

const router = Router();
const prisma = new PrismaClient();

export const getInitialTasks = async (teamId: number, categorizationYearId: number) => {
  const tasks = await prisma.$transaction(async (tx) => {
    const tasks = await tx.initialTask.findMany({
      where: {
        categorizationYearId: categorizationYearId,
      },
      select: {
        id: true,
        name: true,
        description: true,

        displayPriority: true,
      },
      orderBy: [
        {
          displayPriority: 'asc',
        },
        {
          name: 'asc',
        }
      ]
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

  return tasks;
};

router.get('/:categorizationYearId(\\d+)?/:maybeOf(of)?/:teamId(\\d+)?', async (req: Request, res: Response) => {
    let categorizationYearId = Number.parseInt(req.params.categorizationYearId) as (number|null);
    if(Number.isNaN(categorizationYearId)) categorizationYearId = await getCategorizationYearId();
    
    if(categorizationYearId === null){
      res.status(409).json({ message: "no active categorization" }).end();
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
          id: req.session.userId,
      },
      select: {
          teamId: true,
          teamAccepted: true,

          role: true,
      }
    });
    if(!user){ // should never happen
        res.status(500).end();
        return;
    }
    let teamId = -1;
    if(req.params.teamId) {
      // If teamId provided - check that user has permissions to do that

      if(!categorizationYearId || req.params.maybeOf !== 'of'){
        res.status(400).send('Must include year before /of/:teamId');
        return;
      }

      if(user.role === "USER"){
        res.status(403).json({ message: "you don't have permission to view this team" });
        return;
      }

      teamId = Number.parseInt(req.params.teamId);
    }else{
      // If no teamId provided - check if user has been approved access

      if(user.teamId === null){
        res.status(404).json({ message: "you have not yet registered your team" });
        return;
      }
      if(!user.teamAccepted){
          res.status(403).json({ message: "you don't have permission to view this team" });
          return;
      }

      teamId = user.teamId;
    }

    const tasks = await getInitialTasks(teamId, categorizationYearId);
    //console.log(tasks);

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
        team: {
          select: {
            locked: true,
          }
        }
    }
  });
  if(!user){ // should never happen
      res.status(500).end();
      return;
  }
  if(user.teamId === null || user.team === null){
    res.status(404).json({ message: "you have not yet registered your team" });
    return;
  }
  if(!user.teamAccepted){
      res.status(403).json({ message: "you don't have permission to view this team" });
      return;
  }
  if(user.team.locked){
    res.status(409).json({ message: "your team is locked" });
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