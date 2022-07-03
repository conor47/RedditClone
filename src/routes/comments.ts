import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Comment from '../entity/Comment';
import Post from '../entity/Post';
import User from '../entity/User';

export const commentOnPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  const body = req.body.body;
  const user: User = res.locals.user;
  try {
    const post = await Post.findOneOrFail({ identifier, slug });
    const comment = new Comment({ body, user, post });
    await comment.save();
    return res.status(StatusCodes.CREATED).json(comment);
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'post not found' });
  }
};
