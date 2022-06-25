import { Request, Response, Router } from 'express';
import { User } from '../entity/User';
import { validate, isEmpty } from 'class-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const register = async (req: Request, res: Response) => {
  console.log(req.body);

  const { email, username, password } = req.body;

  try {
    const emailUser = await User.findOne({ email });
    const usernameUser = await User.findOne({ username });
    let errors: any = {};

    if (emailUser) {
      errors.email = 'Email already taken';
    }
    if (usernameUser) {
      errors.username = 'Username already taken';
    }
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    const user = new User({ username, email, password });
    errors = await validate(user);
    if (errors.length > 0) {
      console.log(errors);

      return res.status(400).json(errors);
    }
    await user.save();

    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  console.log(username, password);

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

    const token = jwt.sign({ username }, process.env.JWT_SECRET);

    res.set(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600,
        path: '/',
      })
    );
    return res.json({ user });
  } catch (error) {
    console.log(error);
  }
};

const me = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) throw new Error('Unauthenticated');

    const { username }: any = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ username });

    if (!user) throw new Error('Unauthenticated');
    return res.json(user);
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error.message });
  }
};

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.post('/me', me);

export default router;
