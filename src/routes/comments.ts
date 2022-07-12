import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import Comment from '../entity/Comment';
import Post from '../entity/Post';
import User from '../entity/User';
import auth from '../Middleware/auth';

const commentOnPost = async (req: Request, res: Response) => {
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

const getAllComments = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({});
    return res.status(200).json(comments);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ err: 'something went wrong' });
  }
};

const router = Router();

router.post('/:identifier/:slug', auth, commentOnPost);
router.get('/', auth, getAllComments);

export default router;
