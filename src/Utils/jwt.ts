import User from '../entity/User';
import jwt from 'jsonwebtoken';
import { Response } from 'express';
import cookie from 'cookie';

const createJwt = ({ payload }: { payload: User }) => {
  const token = jwt.sign(payload.username, process.env.JWT_SECRET!, {});
  return token;
};

const isTokenValid = ({ token }: { token: string }) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};

const attachCookiesToResponse = ({
  res,
  user,
}: {
  res: Response;
  user: User;
}) => {
  const token = createJwt({ payload: user });
  const oneDay = 1000 * 60 * 60 * 24;

  res.set(
    'Set-Cookie',
    cookie.serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(Date.now() + oneDay),
      sameSite: 'strict',
      maxAge: 3600,
      path: '/',
    })
  );
};

export { createJwt, isTokenValid, attachCookiesToResponse };
