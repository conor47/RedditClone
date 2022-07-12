import { NextFunction, Request, Response } from 'express';
import User from '../entity/User';
import { UnauthenticatedError } from '../errors';

// middleware for extracting token cookie and performing user Authentication.
export default async (_: Request, res: Response, next: NextFunction) => {
  let user: User | undefined = res.locals.user;

  if (!user) {
    throw new UnauthenticatedError('Unauthenticated');
  }
  return next();
};
