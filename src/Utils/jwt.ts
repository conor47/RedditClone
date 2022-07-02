import User from '../entity/User';
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { Response, response } from 'express';
import cookie from 'cookie';

const creatJwt = ({ payload }: { payload: User }) => {
  const token = jwt.sign(payload.username, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_LIFETIME!,
  });
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
  const token = creatJwt({ payload: user });
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

export { creatJwt, isTokenValid, attachCookiesToResponse };
