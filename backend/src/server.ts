import express, { Router, Request, Response } from 'express';
import router from './routes/index';
import requestLogger from './utils/requestLogger';
import { createClient } from 'redis';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import crypto from "crypto";
import authman from './utils/authman';

const redisClient = createClient({ url: "redis://redis:6379" });
redisClient.connect().catch(console.error);

const app = express();

/* basic express config */
app.use(express.json({limit: "100mb"}));
app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex"),
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 }
    })
);
app.use(authman);
app.use(requestLogger);

/* main router */
app.use('/', router);

/* 404 Not Found handler */
app.use('*', (_req: Request, res: Response) => {
    res.status(404).json({
    status: "error",
    message: "endpoint not found",
})});

export default app;