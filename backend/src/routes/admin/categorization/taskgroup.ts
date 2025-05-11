import { Router, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post('/', async (req: Request, res: Response) => {
  let { categorizationYearId, name, lesnaThreshold, puszczanskaThreshold, displayPriority } = req.body;

  if ((categorizationYearId === undefined || typeof categorizationYearId !== 'number')
   || (!name || typeof name !== 'string')
   || (lesnaThreshold === undefined || typeof lesnaThreshold !== 'number')
   || (puszczanskaThreshold === undefined || typeof puszczanskaThreshold !== 'number')) {
    res.status(400).json({ status: "error", message: "body required" });
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
    res.status(404).json({ message: "no such initial task exists" });
    return;
  }

  await prisma.categorizationTaskGroup.create({
    data: {
      categorizationYearId: categorizationYearId,

      name: name,
      lesnaThreshold: lesnaThreshold,
      puszczanskaThreshold: puszczanskaThreshold,

      displayPriority: displayPriority,
    }
  });

  res.status(204).end();
});

router.patch('/:taskId(\\d+)', async (req: Request, res: Response) => {
  const taskId = Number.parseInt(req.params.taskId);
  let { name, lesnaThreshold, puszczanskaThreshold, displayPriority } = req.body;

  if ((!name || typeof name !== 'string') 
   && (lesnaThreshold === undefined || typeof lesnaThreshold !== 'number')
   && (displayPriority === undefined || typeof displayPriority !== 'number')
   && (puszczanskaThreshold === undefined || typeof puszczanskaThreshold !== 'number')) {
    res.status(400).json({ status: "error", message: "patch body required" });
    return;
  }

  // Only ADMIN and TOPLEVEL can do this
  if(req.session.userRole !== "TOPLEVEL_COORDINATOR" && req.session.userRole !== "ADMIN"){
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const taskGroupExists = await prisma.categorizationTaskGroup.count({
    where: {
      id: taskId,
    }
  }) > 0;
  if(!taskGroupExists){
    res.status(404).json({ message: "no such task group exists" });
    return;
  }

  await prisma.categorizationTaskGroup.update({
    where: {
      id: taskId,
    },
    data: {
      name: name,
      
      lesnaThreshold: lesnaThreshold,
      puszczanskaThreshold: puszczanskaThreshold,

      displayPriority: displayPriority,
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

  await prisma.categorizationTaskGroup.deleteMany({
    where: {
      id: taskId,
    }
  });

  res.status(204).end();
});

export default router;