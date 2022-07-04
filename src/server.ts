import 'reflect-metadata';
require('express-async-errors');
import express, { Request, Response } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import session from 'express-session';
import connectRedis from 'connect-redis';
import * as redis from 'redis';

import authRoutes from './routes/auth';
import postRoutes from './routes/post';
import subRoutes from './routes/subs';
import trim from './Middleware/trim';
import notFoundMiddleware from './Middleware/not-found';
import errorHandlerMiddleware from './Middleware/error-handler';

dotenv.config();
const app = express();
const redisStore = connectRedis(session);

const redisClient = redis.createClient();

redisClient.on('error', function (err) {
  console.log('Could not establish a connection with redis' + err);
});
redisClient.on('connect', function (err) {
  console.log('Connected to redis successfully');
});

app.use(
  session({
    store: new redisStore({ client: redisClient as any }),
    secret: 'secret$^134',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: false,
      maxAge: 1000 * 60 * 10,
    },
  })
);

app.use(express.json());
app.use(morgan('dev'));
app.use(trim);
app.get('/', (_: Request, res: Response) => {
  res.send('Hello');
});
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/subs', subRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;
