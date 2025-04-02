import { Router } from 'express';
import authRouter from './auth/index';
import userRouter from './user/index';
import districtsRouter from './districts/index';
import teamsRouter from './teams/index';
import tasksRouter from './tasks/index';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/districts', districtsRouter);
router.use('/teams', teamsRouter);
router.use('/tasks', tasksRouter);

export default router;