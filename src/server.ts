require('express-async-errors');
import express from 'express';
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
const RedisStore = connectRedis(session);
export const redisClient = redis.createClient();
const redisStore = new RedisStore({
  host: 'localhost',
  port: 6379,
  client: redisClient as any,
  ttl: 60 * 60 * 10,
});

redisClient.on('error', (err) => {
  console.log('Redis error', err);
});

redisClient.on('connect', function (err) {
  console.log('Connected to redis successfully');
});

app.use(express.json());
app.use(morgan('dev'));
app.use(
  session({
    store: redisStore,
    name: 'qid',
    secret: process.env.SESSION_SECRET || 'lkasjd98g329ubed2yhb',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000000000,
    },
  })
);
app.use(trim);
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/subs', subRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;
