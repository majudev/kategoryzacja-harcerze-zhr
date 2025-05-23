import { Router, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
import initialRouter from './initial';
import { calculateTaskScore } from "../../utils/taskcalc";
import { getCategorizationYearId } from "../categorization/year";

const router = Router();
const prisma = new PrismaClient();

router.use('/initial', initialRouter);

export const getTasks = async (teamId: number, categorizationYear: number) => {
  const tasks = await prisma.$transaction(async (tx) => {
    const taskGroups = await tx.categorizationTaskGroup.findMany({
      where: {
        categorizationYearId: categorizationYear,
      },
      select: {
        id: true,
        name: true,

        lesnaThreshold: true,
        puszczanskaThreshold: true,

        primaryTasks: {
          select: {
            id: true,
            name: true,
            description: true,

            primaryGroupId: true,
            secondaryGroupId: true,
            split: true,

            type: true,
            maxPoints: true,
            multiplier: true,
            refValId: true,

            obligatory: true,
          }
        },
        secondaryTasks: {
          select: {
            id: true,
            name: true,
            description: true,

            primaryGroupId: true,
            secondaryGroupId: true,
            split: true,

            type: true,
            maxPoints: true,
            multiplier: true,
            refValId: true,

            obligatory: true,
          }
        },

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

        let primaryGroupName = undefined;
        let secondaryGroupName = undefined;
        if(task.secondaryGroupId !== null){
          primaryGroupName = taskGroups.find(gr => gr.id === task.primaryGroupId)?.name;
          secondaryGroupName = taskGroups.find(gr => gr.id === task.secondaryGroupId)?.name;
        }


        const rawScore = calculateTaskScore(task.type, (joint !== undefined ? joint.value : 0), task.maxPoints, task.multiplier, 1);
        let primaryMaxPoints = undefined;
        let primaryPoints = undefined;
        let secondaryMaxPoints = undefined;
        let secondaryPoints = undefined;
        if(task.secondaryGroupId !== null){
          primaryPoints = rawScore * task.split;
          secondaryPoints = rawScore * (1-task.split);
          primaryMaxPoints = task.maxPoints * task.split;
          secondaryMaxPoints = task.maxPoints * (1-task.split);
        }

        return {
          ...task,
          value: (joint !== undefined ? joint.value : 0),
          // Description of the spaghetti below:
          // if TASK is obligatory, ignore JOINT's favourite value and return
          // JOINT's value of favourite. If JOINT's value of favourite is unset,
          // return false (that is the default).
          favourite: (joint !== undefined ? (joint.favourite || task.obligatory) : task.obligatory),
          points: rawScore,

          primaryGroupName,
          secondaryGroupName,
          primaryPoints,
          secondaryPoints,
          primaryMaxPoints,
          secondaryMaxPoints,
        };
      });

      const collectedSplitPoints = populatedTasks.reduce((prev, t) => prev + (t.secondaryGroupId === null ? t.points : t.secondaryGroupId === taskGroup.id ? t.secondaryPoints as number : t.primaryPoints as number), 0);
      const maxSplitPoints = populatedTasks.reduce((prev, t) => prev + (t.secondaryGroupId === null ? t.maxPoints : t.secondaryGroupId === taskGroup.id ? t.secondaryMaxPoints as number : t.primaryMaxPoints as number), 0);
      const maxFilteredSplitPoints = populatedTasks.filter(t => t.favourite).reduce((prev, t) => prev + (t.secondaryGroupId === null ? t.maxPoints : t.secondaryGroupId === taskGroup.id ? t.secondaryMaxPoints as number : t.primaryMaxPoints as number), 0);
      const achievedSymbol = collectedSplitPoints >= taskGroup.puszczanskaThreshold ? "PUSZCZANSKA" : collectedSplitPoints >= taskGroup.lesnaThreshold ? "LESNA" : "POLOWA";

      return {
        ...taskGroup,
        primaryTasks: undefined,
        secondaryTasks: undefined,
        tasks: populatedTasks,

        collectedSplitPoints,
        maxSplitPoints,
        maxFilteredSplitPoints,

        achievedSymbol,
      };
    });

    /// This part does the "second pass" and substitutes REF task calculations with proper ones
    /// Doing it in two stages is required, as we cannot trust that refVal has proper value on the first pass,
    /// because the calculations are done out-of-order.
    const mergedTaskGroupsWithRefVals = mergedTaskGroups.map((taskGroup) => {
      const tasksWithRefVals = taskGroup.tasks.map((task) => {
        if((task.type !== "LINEAR_REF" && task.type !== "PARABOLIC_REF") || task.refValId === null) return task;

        const refVal = mergedTaskGroups.flatMap((tg) => tg.tasks).filter(t => t.id === task.refValId)[0].value;
        const rawScore = calculateTaskScore(task.type, task.value, task.maxPoints, task.multiplier, refVal);
        
        let primaryMaxPoints = undefined;
        let primaryPoints = undefined;
        let secondaryMaxPoints = undefined;
        let secondaryPoints = undefined;
        if(task.secondaryGroupId !== null){
          primaryPoints = rawScore * task.split;
          secondaryPoints = rawScore * (1-task.split);
          primaryMaxPoints = task.maxPoints * task.split;
          secondaryMaxPoints = task.maxPoints * (1-task.split);
        }

        return {
          ...task,
          points: rawScore,

          primaryPoints,
          secondaryPoints,
          primaryMaxPoints,
          secondaryMaxPoints,
        };
      });

      const collectedSplitPoints = tasksWithRefVals.reduce((prev, t) => prev + (t.secondaryGroupId === null ? t.points : t.secondaryGroupId === taskGroup.id ? t.secondaryPoints as number : t.primaryPoints as number), 0);
      const maxSplitPoints = tasksWithRefVals.reduce((prev, t) => prev + (t.secondaryGroupId === null ? t.maxPoints : t.secondaryGroupId === taskGroup.id ? t.secondaryMaxPoints as number : t.primaryMaxPoints as number), 0);
      const maxFilteredSplitPoints = tasksWithRefVals.filter(t => t.favourite).reduce((prev, t) => prev + (t.secondaryGroupId === null ? t.maxPoints : t.secondaryGroupId === taskGroup.id ? t.secondaryMaxPoints as number : t.primaryMaxPoints as number), 0);
      const achievedSymbol = collectedSplitPoints >= taskGroup.puszczanskaThreshold ? "PUSZCZANSKA" : collectedSplitPoints >= taskGroup.lesnaThreshold ? "LESNA" : "POLOWA";

      return {
        ...taskGroup,

        tasks: tasksWithRefVals,

        collectedSplitPoints,
        maxSplitPoints,
        maxFilteredSplitPoints,

        achievedSymbol,
      }
    });

    return mergedTaskGroupsWithRefVals.sort((a, b) => (a.displayPriority !== b.displayPriority) ? (a.displayPriority - b.displayPriority) : a.name.localeCompare(b.name));
  });

  return tasks;
}

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

    const tasks = await getTasks(teamId, categorizationYearId);

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

router.put('/:taskId', async (req: Request, res: Response) => {
  const taskId = Number.parseInt(req.params.taskId);
  const value = Number.parseInt(req.body.value);

  if(isNaN(taskId)){
    res.status(400).json({ message: "task id must be an integer" });
    return;
  }

  if(isNaN(value) || value < 0){
    res.status(400).json({ message: "body must be a non-negative integer" });
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

  await prisma.taskJoint.upsert({
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