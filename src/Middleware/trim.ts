import { NextFunction, Request, Response } from 'express';

// middleware which for trimming string property values in the request body
export default (req: Request, res: Response, next: NextFunction): void => {
  const exceptions: string[] = ['password'];

  Object.keys(req.body).forEach((key) => {
    if (!exceptions.includes(key) && typeof req.body[key] === 'string') {
      req.body[key] = req.body[key].trim();
    }
  });
  next();
};
