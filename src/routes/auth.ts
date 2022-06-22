import { Request, Response, Router } from 'express';
import { User } from '../entity/User';

const register = async (req: Request, res: Response) => {
  console.log(req.body);

  const { email, username, password } = req.body;

  try {
    const user = new User({ username, email, password });
    await user.save();
    res.status(200).send('User created');
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const router = Router();
router.post('/register', register);

export default router;
