import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import Comment from '../entity/Comment';
import Post from '../entity/Post';
import User from '../entity/User';
import { BadRequestError } from '../errors';
import auth from '../Middleware/auth';
import user from '../Middleware/user';

// make a comment on a post
const commentOnPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  const body = req.body.body;
  const parentId = req.body.parentId;
  console.log('parentId', parentId);

  const user: User = res.locals.user;
  try {
    const post = await Post.findOneOrFail({ identifier, slug });
    const comment = new Comment({ body, user, post, parentId });
    await comment.save();
    return res.status(StatusCodes.CREATED).json(comment);
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'post not found' });
  }
};

// fetch all comments across all posts
const getAllComments = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({});
    return res.status(200).json(comments);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ err: 'something went wrong' });
  }
};

// fetch a single comment
const getSingleComment = async (req: Request, res: Response) => {
  const { identifier } = req.params;

  try {
    if (!identifier) {
      throw new BadRequestError('Comment identifier is required');
    }
    const comment = await Comment.findOneOrFail(
      { identifier },
      { relations: ['votes'] }
    );
    return res.status(200).json(comment);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ err: 'Something went wrong' });
  }
};

// fetch all of the comments for a single post
const getPostComments = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  try {
    const post = await Post.findOneOrFail({ identifier, slug });

    const comments = await Comment.find({
      where: { post },
      order: { createdAt: 'DESC' },
      relations: ['votes'],
    });

    if (res.locals.user) {
      comments.forEach((comment) => comment.setUserVote(res.locals.user));
    }

    return res.json(comments);
  } catch (error) {
    console.log(error);
    throw new BadRequestError('Something went wrong');
  }
};

const editComment = async (req: Request, res: Response) => {
  const { identifier } = req.params;
  const { body } = req.body;

  try {
    const comment = await Comment.findOneOrFail({ identifier });

    if (comment.username !== res.locals.user.username) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ error: 'Unauthorized' });
    }
    comment.body = body;
    await comment.save();
    return res.status(StatusCodes.OK).json(comment);
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Something went wrong' });
  }
};

const deleteComment = async (req: Request, res: Response) => {
  const { identifier } = req.params;
  const comment = await Comment.findOneOrFail({ identifier });

  if (comment.username !== res.locals.user.username) {
    return res.status(StatusCodes.UNAUTHORIZED).send({ error: 'Unauthorized' });
  }

  comment.body = null;
  comment.username = null;
  try {
    await comment.save();
    return res.status(StatusCodes.OK).json(comment);
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Something went wrong' });
  }
};

const router = Router();

router.post('/:identifier/:slug', user, auth, commentOnPost);
router.get('/', getAllComments);
router.get('/:identifier', getSingleComment);
router.patch('/:identifier', user, auth, editComment);
router.delete('/:identifier', user, auth, deleteComment);
router.get('/:identifier/:slug/comments', user, getPostComments);

export default router;
