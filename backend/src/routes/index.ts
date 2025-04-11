import { Router } from 'express';
import authRouter from './auth/index';
import userRouter from './user/index';
import districtsRouter from './districts/index';
import teamsRouter from './teams/index';
import tasksRouter from './tasks/index';
import categorizationRouter from './categorization/index';
import rankingRouter from './ranking/index';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/districts', districtsRouter);
router.use('/teams', teamsRouter);
router.use('/tasks', tasksRouter);
router.use('/categorization', categorizationRouter);
router.use('/ranking', rankingRouter);

export default router;