import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express, { Request, Response } from 'express';
import morgan from 'morgan';

import authRoutes from './routes/auth';

const app = express();

app.use(morgan('dev'));
app.get('/', (req: Request, res: Response) => {
  res.send('Hello');
});
app.use('/api/auth', authRoutes);

app.listen(5001, async () => {
  console.log(`Server running at http://localhost:5000`);
  try {
    await createConnection();
    console.log('database connected');
  } catch (error) {
    console.log(error);
  }
});
