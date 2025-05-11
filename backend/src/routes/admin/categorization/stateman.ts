import { Router, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";
import { getTasks } from "../../tasks";
import { getCategory } from "../../categorization";
import { getCategorizationYearId } from "../../categorization/year";
import { rebuildRanking } from "../../../utils/rankingbuilder";
import redis from "../../../utils/redis";

const router = Router();
const prisma = new PrismaClient();

router.patch('/activate/:categorizationYearId(\\d+)', async (req: Request, res: Response) => {
  const catYearToActivateId = Number.parseInt(req.params.categorizationYearId);

  // Only ADMIN and TOPLEVEL can do this
  if(req.session.userRole !== "TOPLEVEL_COORDINATOR" && req.session.userRole !== "ADMIN"){
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const catYearToActivate = await prisma.categorizationYear.findUnique({
    where: {
      id: catYearToActivateId,
    }
  });
  if(catYearToActivate === null){
    res.status(404).json({ message: "no such categorization year exists" });
    return;
  }

  const currentlyActiveCatYearId = await getCategorizationYearId(true);
  const currentlyActiveCatYear = currentlyActiveCatYearId === null ? null : await prisma.categorizationYear.findUnique({
    where: {
      id: currentlyActiveCatYearId,
    }
  });
  if(currentlyActiveCatYearId !== null && currentlyActiveCatYear === null){ // should never happen
    res.status(500).json({ message: "critical database incosistency: currently active categorization year does not exist, yet database states it should" });
    return;
  }

  await prisma.$transaction(async (tx) => {
    // Release the individual locks
    await tx.team.updateMany({
      data: {
        locked: false,
      }
    });

    // Close the currently active categorization year
    if(currentlyActiveCatYearId !== null){
      await tx.categorizationYear.update({
        where: {
          id: currentlyActiveCatYearId,
        },
        data: {
          state: "FINISHED",
        }
      });

      // Rebuild the ranking
      const rankingString = await rebuildRanking(currentlyActiveCatYearId, true);
      await tx.ranking.upsert({
        where: {
          categorizationYearId: currentlyActiveCatYearId,
        },
        create: {
          categorizationYearId: currentlyActiveCatYearId,
          JSON: rankingString,
        },
        update: {
          JSON: rankingString,
        }
      });
    }

    // Open the new categorization year
    await tx.categorizationYear.update({
      where: {
        id: catYearToActivateId,
      },
      data: {
        state: "OPEN",
      }
    });

    // If the newly opened categorization year has the active ranking - purge it
    /*await rebuildRanking(catYearToActivateId, true);
    await tx.ranking.deleteMany({
      where: {
        categorizationYearId: catYearToActivateId,
      }
    });*/
  });

  // Purge redis cache
  redis.del('currentCategorizationYearId');

  res.status(204).end();
});

router.patch('/close', async (req: Request, res: Response) => {
  // Only ADMIN and TOPLEVEL can do this
  if(req.session.userRole !== "TOPLEVEL_COORDINATOR" && req.session.userRole !== "ADMIN"){
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const currentlyActiveCatYearId = await getCategorizationYearId(true);
  const currentlyActiveCatYear = currentlyActiveCatYearId === null ? null : await prisma.categorizationYear.findUnique({
    where: {
      id: currentlyActiveCatYearId,
    }
  });
  if(currentlyActiveCatYear === null){
    res.status(409).json({ message: "no currently open categorization - cannot close anything" });
    return;
  }

  await prisma.$transaction(async (tx) => {
    // Release the individual locks
    await tx.team.updateMany({
      data: {
        locked: false,
      }
    });

    // Close the currently active categorization year
    await tx.categorizationYear.update({
      where: {
        id: currentlyActiveCatYear.id,
      },
      data: {
        state: "FINISHED",
      }
    });

    // Rebuild the ranking
    const rankingString = await rebuildRanking(currentlyActiveCatYear.id, true);
    await tx.ranking.upsert({
      where: {
        categorizationYearId: currentlyActiveCatYear.id,
      },
      create: {
        categorizationYearId: currentlyActiveCatYear.id,
        JSON: rankingString,
      },
      update: {
        JSON: rankingString,
      }
    });
  });

  // Purge redis cache
  redis.del('currentCategorizationYearId');

  res.status(204).end();
});

router.patch('/draftify/:categorizationYearId(\\d+)', async (req: Request, res: Response) => {
  const catYearToDraftifyId = Number.parseInt(req.params.categorizationYearId);

  // Only ADMIN and TOPLEVEL can do this
  if(req.session.userRole !== "TOPLEVEL_COORDINATOR" && req.session.userRole !== "ADMIN"){
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const catYearToDraftify = await prisma.categorizationYear.findUnique({
    where: {
      id: catYearToDraftifyId,
    }
  });
  if(catYearToDraftify === null){
    res.status(404).json({ message: "no such categorization year exists" });
    return;
  }
  if(catYearToDraftify.state === "OPEN"){
    res.status(409).json({ message: "you cannot draftify active categorization" });
    return;
  }

  await prisma.$transaction(async (tx) => {
    // Draftify the categorization year
    await tx.categorizationYear.update({
      where: {
        id: catYearToDraftifyId,
      },
      data: {
        state: "DRAFT",
      }
    });

    // If the newly draftified categorization year has the active ranking - purge it
    /*await rebuildRanking(catYearToDraftifyId, true);
    await tx.ranking.deleteMany({
      where: {
        categorizationYearId: catYearToDraftifyId,
      }
    });*/
  });

  res.status(204).end();
});

router.patch('/ranking/rebuild/:categorizationYearId(\\d+)', async (req: Request, res: Response) => {
  const catYearToRebuildId = Number.parseInt(req.params.categorizationYearId);

  // Only ADMIN and TOPLEVEL can do this
  if(req.session.userRole !== "TOPLEVEL_COORDINATOR" && req.session.userRole !== "ADMIN"){
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const catYearToRebuild = await prisma.categorizationYear.findUnique({
    where: {
      id: catYearToRebuildId,
    }
  });
  if(catYearToRebuild === null){
    res.status(404).json({ message: "no such categorization year exists" });
    return;
  }
  if(catYearToRebuild.state === "OPEN"){
    res.status(409).json({ message: "you cannot rebuild the active categorization" });
    return;
  }

  const rankingString = await rebuildRanking(catYearToRebuildId, true);
  await prisma.ranking.upsert({
    where: {
      categorizationYearId: catYearToRebuildId,
    },
    update: {
      JSON: rankingString,
    },
    create: {
      categorizationYearId: catYearToRebuildId,
      JSON: rankingString,
    }
  });

  res.status(204).end();
});

router.patch('/ranking/makedynamic/:categorizationYearId(\\d+)', async (req: Request, res: Response) => {
  const catYearToRebuildId = Number.parseInt(req.params.categorizationYearId);

  // Only ADMIN and TOPLEVEL can do this
  if(req.session.userRole !== "TOPLEVEL_COORDINATOR" && req.session.userRole !== "ADMIN"){
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const catYearToRebuild = await prisma.categorizationYear.findUnique({
    where: {
      id: catYearToRebuildId,
    }
  });
  if(catYearToRebuild === null){
    res.status(404).json({ message: "no such categorization year exists" });
    return;
  }

  await rebuildRanking(catYearToRebuildId, true);
  await prisma.ranking.deleteMany({
    where: {
      categorizationYearId: catYearToRebuildId,
    },
  });

  res.status(204).end();
});

export default router;