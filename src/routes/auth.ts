import { Request, Response, Router } from 'express';
import { validate, isEmpty } from 'class-validator';
import bcrypt from 'bcrypt';
import cookie from 'cookie';

import { attachCookiesToResponse } from '../Utils/jwt';
import auth from '../Middleware/auth';
import User from '../entity/User';
import { BadRequestError } from '../errors';
import { StatusCodes } from 'http-status-codes';

// route handler for handling user registration.
const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  // try {
  const emailUser = await User.findOne({ email });
  const usernameUser = await User.findOne({ username });
  let errors: { [key: string]: string } = {};

  if (emailUser) {
    throw new BadRequestError('email already taken');
    // errors.email = 'Email already taken';
  }
  if (usernameUser) {
    throw new BadRequestError('username already taken');
    // errors.username = 'Username already taken';
  }
  if (Object.keys(errors).length > 0) {
    return res.status(StatusCodes.BAD_REQUEST).json(errors);
  }

  const user = new User({ username, email, password });
  const validationErrors = await validate(user);
  if (validationErrors.length > 0) {
    return res.status(StatusCodes.BAD_REQUEST).json(validationErrors);
  }
  await user.save();

  return res.status(StatusCodes.OK).send(user);
  // } catch (error) {
  //   console.log(error);
  //   return res.status(500).json(error);
  // }
};

// route handler for handling user login
const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const errors: { [key: string]: string } = {};
    if (isEmpty(username)) errors.username = 'Username must not be empty';
    if (isEmpty(password)) errors.password = 'Password must not be empty';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ password: 'Password is invalid' });
    }

    console.log('session --------------------------', req.session);

    return res.json({ user });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

// route for returning the currently logged in user
const me = async (_: Request, res: Response) => {
  return res.json(res.locals.user);
};

// router handler for handling user logout
const logout = async (_: Request, res: Response) => {
  res.set(
    'Set-Cookie',
    cookie.serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/',
    })
  );
  return res.status(200).json({ success: true });
};

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, me);
router.get('/logout', auth, logout);

export default router;
