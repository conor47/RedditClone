import { Request, Response, Router } from 'express';
import { User } from '../entity/User';
import { validate } from 'class-validator';

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

const router = Router();
router.post('/register', register);

export default router;
