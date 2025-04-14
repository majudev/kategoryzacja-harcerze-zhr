import { Router, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";

import categorizationRouter from './categorization/index';
import districtsRouter from './districts/index';
import teamsRouter from './teams/index';
import usersRouter from './users/index';

const router = Router();

router.use('/categorization', categorizationRouter);
router.use('/districts', districtsRouter);
router.use('/teams', teamsRouter);
router.use('/users', usersRouter);

export default router;