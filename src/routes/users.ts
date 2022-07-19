import { Request, Response, Router } from 'express';
import Comment from '../entity/Comment';
import Post from '../entity/Post';
import User from '../entity/User';
import { BadRequestError } from '../errors';
import user from '../Middleware/user';

// route for fetching a specific users posts and comments
const getUserSubmissions = async (req: Request, res: Response) => {
  try {
    const user = await User.findOneOrFail({
      where: { username: req.params.username },
      select: ['username', 'createdAt'],
    });

    const posts = await Post.find({
      where: { user },
      relations: ['comments', 'votes', 'sub'],
    });
    const comments = await Comment.find({
      where: { user },
      relations: ['post'],
    });

    if (res.locals.user) {
      posts.forEach((post) => post.setUserVote(res.locals.user));
    }
    if (res.locals.user) {
      comments.forEach((comment) => comment.setUserVote(res.locals.user));
    }

    // create an array of objects containing each post and comment. Type property allows us to differentiate posts from comments
    let submissions: any[] = [];
    posts.forEach((post) =>
      submissions.push({ type: 'post', ...post.toJSON() })
    );
    comments.forEach((comment) =>
      submissions.push({ type: 'comment', ...comment.toJSON() })
    );

    type commentPost = Post | Comment;

    // sort the array of objects based on created at time
    submissions.sort((a: commentPost, b: commentPost) => {
      if (b.createdAt > a.createdAt) {
        return 1;
      } else if (b.createdAt < a.createdAt) {
        return -1;
      } else {
        return 0;
      }
    });

    return res.json({ user, submissions });
  } catch (error) {
    console.log(error);
    throw new BadRequestError('Something went wrong');
  }
};

const router = Router();

router.get('/:username', user, getUserSubmissions);

export default router;
