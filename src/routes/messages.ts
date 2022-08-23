import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import Message from '../entity/Message';
import User from '../entity/User';
import auth from '../Middleware/auth';
import user from '../Middleware/user';

const createMessage = async (req: Request, res: Response) => {
  const { body, recipientIdentifier } = req.body;
  const sender: User = res.locals.user;

  if (!body || body === '' || !recipientIdentifier) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: 'Something went wrong' });
  }

  try {
    const recipient = await User.findOneOrFail({
      where: { id: recipientIdentifier },
    });

    const post = new Message({
      body,
      creatorId: sender,
      recipientName: recipient,
    });
    await post.save();
    res.status(StatusCodes.OK).send(post);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send({ error: 'Something went wrong' });
  }
};

const router = Router();

router.post('/:id', user, auth, createMessage);

export default router;
