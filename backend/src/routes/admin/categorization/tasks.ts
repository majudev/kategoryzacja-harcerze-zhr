import { Router, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
import groupRouter from "./taskgroup";

const router = Router();
const prisma = new PrismaClient();

router.use('/group', groupRouter);

router.post('/', async (req: Request, res: Response) => {
  let { name, description, primaryGroupId, secondaryGroupId, split, type, maxPoints, multiplier, refValId, obligatory } = req.body;

  if ((primaryGroupId === undefined || typeof primaryGroupId !== 'number')
   || (secondaryGroupId !== undefined && secondaryGroupId !== null && typeof secondaryGroupId !== 'number')
   || (!name || typeof name !== 'string')
   || (description !== undefined && description !== null && typeof description !== 'string')
   || (split !== undefined && typeof split !== 'number')
   || (type !== "BOOLEAN" && type !== "LINEAR" && type !== "LINEAR_REF" && type !== "PARABOLIC_REF" && type !== "REFONLY")
   || (maxPoints === undefined || typeof maxPoints !== 'number' || (type !== "REFONLY" && maxPoints <= 0))
   || (multiplier !== undefined && multiplier !== null && (typeof multiplier !== 'number' || multiplier <= 0))
   || (refValId !== undefined && refValId !== null && typeof refValId !== 'number')
   || (typeof obligatory !== 'boolean')) {
    res.status(400).json({ status: "error", message: "body required" });
    return;
  }

  // Only ADMIN and TOPLEVEL can do this
  if(req.session.userRole !== "TOPLEVEL_COORDINATOR" && req.session.userRole !== "ADMIN"){
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const taskGroup = await prisma.categorizationTaskGroup.findUnique({
    where: {
      id: primaryGroupId,
    },
    select: {
      categorizationYearId: true,
    }
  });
  const secondaryTaskGroupExists = secondaryGroupId === undefined || secondaryGroupId === null || await prisma.categorizationTaskGroup.count({
    where: {
      id: secondaryGroupId,
    }
  }) > 0;
  if(taskGroup === null || !secondaryTaskGroupExists){
    res.status(404).json({ message: "no such task group exists" });
    return;
  }

  if(type === "LINEAR" || type === "LINEAR_REF" || type === "PARABOLIC_REF"){
    if(!multiplier){
      res.status(400).json({ message: "with task type " + type + " there has to be multiplier set" });
      return;
    }
  }else multiplier = null;

  if(type === "LINEAR_REF" || type === "PARABOLIC_REF"){
    if(!refValId){
      res.status(400).json({ message: "with task type " + type + " there has to be refValId set" });
      return;
    }

    const refValExists = await prisma.categorizationTask.count({
      where: {
        id: refValId,
        OR: [
          {
            primaryGroup: {
              categorizationYearId: taskGroup.categorizationYearId,
            }
          },
          {
            secondaryGroup: {
              categorizationYearId: taskGroup.categorizationYearId,
            }
          }
        ]
      }
    }) > 0;
    if(!refValExists){
      res.status(409).json({ message: "provided refValId is invalid" });
      return;
    }
  }else refValId = null;

  if(type === "REFONLY"){
    secondaryGroupId = null;
    obligatory = true;
    maxPoints = 0;
  }

  if(secondaryGroupId !== undefined && secondaryGroupId !== null){
    if(!split){
      res.status(400).json({ message: "if secondaryGroupId is provided, there has to be split set" });
      return;
    }
  }else split = 1;

  await prisma.categorizationTask.create({
    data: {
      name: name,
      description: description,

      primaryGroupId: primaryGroupId,
      secondaryGroupId: secondaryGroupId,
      split: split,

      type: type,
      maxPoints: maxPoints,
      multiplier: multiplier,
      refValId: refValId,

      obligatory: obligatory,
    }
  });

  res.status(204).end();
});

router.patch('/:taskId(\\d+)', async (req: Request, res: Response) => {
  const taskId = Number.parseInt(req.params.taskId);
  let { name, description, primaryGroupId, secondaryGroupId, split, type, maxPoints, multiplier, refValId, obligatory } = req.body;

  if ((!name || typeof name !== 'string') 
   && (!description || typeof description !== 'string') 
   && (primaryGroupId === undefined || typeof primaryGroupId !== 'number')
   && (secondaryGroupId === undefined || typeof secondaryGroupId !== 'number')
   && (split === undefined || typeof split !== 'number')
   && (type !== "BOOLEAN" && type !== "LINEAR" && type !== "LINEAR_REF" && type !== "PARABOLIC_REF" && type !== "REFONLY")
   && (maxPoints === undefined || typeof maxPoints !== 'number')
   && (multiplier === undefined || typeof multiplier !== 'number')
   && (refValId === undefined || typeof refValId !== 'number')
   && (refValId === undefined || typeof refValId !== 'number')
   && (typeof obligatory !== 'boolean')) {
    res.status(400).json({ status: "error", message: "patch body required" });
    return;
  }

  // Only ADMIN and TOPLEVEL can do this
  if(req.session.userRole !== "TOPLEVEL_COORDINATOR" && req.session.userRole !== "ADMIN"){
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const task = await prisma.categorizationTask.findUnique({
    where: {
      id: taskId,
    }
  });
  if(task === null){
    res.status(404).json({ message: "no such task exists" });
    return;
  }

  if(primaryGroupId === undefined || primaryGroupId === null) primaryGroupId = task.primaryGroupId;
  if(secondaryGroupId === undefined) secondaryGroupId = task.secondaryGroupId;
  const taskGroup = await prisma.categorizationTaskGroup.findUnique({
    where: {
      id: primaryGroupId,
    },
    select: {
      categorizationYearId: true,
    }
  });
  const secondaryTaskGroupExists = secondaryGroupId === null || await prisma.categorizationTaskGroup.count({
    where: {
      id: secondaryGroupId,
    }
  }) > 0;
  if(taskGroup === null || !secondaryTaskGroupExists){
    res.status(404).json({ message: "no such task group exists" });
    return;
  }

  if(type === undefined || type === null) type = task.type;
  if(type === "LINEAR" || type === "LINEAR_REF" || type === "PARABOLIC_REF"){
    if(multiplier === undefined) multiplier = task.multiplier;
    if(!multiplier){
      res.status(400).json({ message: "with task type " + type + " there has to be multiplier set" });
      return;
    }
  }else multiplier = null;

  if(type === "REFONLY"){
    secondaryGroupId = null;
    obligatory = true;
  }

  if(refValId === undefined) refValId = task.refValId;
  if(type === "LINEAR_REF" || type === "PARABOLIC_REF"){
    if(refValId === undefined) refValId = task.refValId;
    if(!refValId){
      res.status(400).json({ message: "with task type " + type + " there has to be refValId set" });
      return;
    }

    const refValExists = await prisma.categorizationTask.count({
      where: {
        id: refValId,
        OR: [
          {
            primaryGroup: {
              categorizationYearId: taskGroup.categorizationYearId,
            }
          },
          {
            secondaryGroup: {
              categorizationYearId: taskGroup.categorizationYearId,
            }
          }
        ]
      }
    }) > 0;
    if(!refValExists){
      res.status(409).json({ message: "provided refValId is invalid" });
      return;
    }
  }else refValId = null;

  if(split === undefined || split === null) split = task.split;
  if(secondaryGroupId !== null){
    if(!split){
      res.status(400).json({ message: "if secondaryGroupId is provided, there has to be split set" });
      return;
    }
  }else split = 1;

  await prisma.categorizationTask.update({
    where: {
      id: taskId,
    },
    data: {
      name: name,
      description: description,

      primaryGroupId: primaryGroupId,
      secondaryGroupId: secondaryGroupId,
      split: split,

      type: type,
      maxPoints: maxPoints,
      multiplier: multiplier,
      refValId: refValId,

      obligatory: obligatory,
    },
    select: {
      id: true,
    }
  });

  res.status(204).end();
});

router.delete('/:taskId(\\d+)', async (req: Request, res: Response) => {
  const taskId = Number.parseInt(req.params.taskId);

  // Only ADMIN and TOPLEVEL can do this
  if(req.session.userRole !== "TOPLEVEL_COORDINATOR" && req.session.userRole !== "ADMIN"){
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  await prisma.categorizationTask.deleteMany({
    where: {
      id: taskId,
    }
  });

  res.status(204).end();
});

export default router;