import { Request, Response, Router } from 'express';
import Subscription from '../entity/Subscriptions';
import User from '../entity/User';
import auth from '../Middleware/auth';
import { StatusCodes } from 'http-status-codes';

import user from '../Middleware/user';
import Sub from '../entity/Sub';

// route for creating a subscription between a user and a sub
const createSubscription = async (req: Request, res: Response) => {
  const user: User = res.locals.user;
  const { subname } = req.params;

  if (!subname) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: 'Something went wrong' });
  }

  try {
    const sub = await Sub.findOneOrFail({ where: { name: subname } });
    const subscription = await Subscription.create({ sub, user });
    await subscription.save();
    return res.status(StatusCodes.OK).send(subscription);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: 'Something went wrong' });
  }
};

// route for deleting a subscription between a user and a sub
const deleteSubsciption = async (req: Request, res: Response) => {
  const user: User = res.locals.user;
  const { subname } = req.params;

  if (!subname) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: 'Something went wrong' });
  }

  try {
    const sub = await Sub.findOneOrFail({ where: { name: subname } });
    const subscription = await Subscription.findOneOrFail({
      where: { user, sub },
    });
    await subscription.remove();
    return res.status(StatusCodes.OK).send({});
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: 'Something went wrong' });
  }
};

const router = Router();

router.post('/:subname', user, auth, createSubscription);
router.delete('/:subname', user, auth, deleteSubsciption);

export default router;
