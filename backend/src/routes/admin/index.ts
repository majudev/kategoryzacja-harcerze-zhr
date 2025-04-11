import { Router, Request, Response } from "express";

import { PrismaClient } from "@prisma/client";

import categorizationRouter from './categorization/index';
import districtsRouter from './districts/index';

const router = Router();

router.use('/categorization', categorizationRouter);
router.use('/districts', districtsRouter);

export default router;