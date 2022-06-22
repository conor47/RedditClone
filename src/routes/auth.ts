import { Request, Response, Router } from 'express';

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
  } catch (error) {
    console.log(error);
  }
};

const router = Router();
router.post('/register', register);

export default router;
