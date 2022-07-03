import 'reflect-metadata';
import express, { Request, Response } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieparser from 'cookie-parser';

import authRoutes from './routes/auth';
import postRoutes from './routes/post';
import subRoutes from './routes/subs';
import trim from './Middleware/trim';
import notFoundMiddleware from './Middleware/not-found';

dotenv.config();
const app = express();

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

export default app;
