import { NextFunction, Request, Response } from 'express';
import User from '../entity/User';
import { isTokenValid } from '../Utils/jwt';
import { UnauthenticatedError } from '../errors';

// middleware for extracting token cookie and performing user Authentication.
export default async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) throw new UnauthenticatedError('Unauthenticated');

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT SECRET environment variable must be defined');
  }

  const username = isTokenValid({ token });
  let user: User | undefined;
  if (typeof username === 'string') {
    user = await User.findOne({ username });
  }

  if (!user) throw new UnauthenticatedError('Unauthenticated');

  res.locals.user = user;
  next();
};
