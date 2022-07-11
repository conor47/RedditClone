import 'reflect-metadata';
require('express-async-errors');
import express, { Request, Response } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieparser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth';
import postRoutes from './routes/post';
import subRoutes from './routes/subs';
import trim from './Middleware/trim';
import notFoundMiddleware from './Middleware/not-found';
import errorHandlerMiddleware from './Middleware/error-handler';

dotenv.config();
const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(morgan('dev'));
app.use(trim);
app.use(cookieparser());
app.get('/', (_: Request, res: Response) => {
  res.send('Hello');
});
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/subs', subRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;
