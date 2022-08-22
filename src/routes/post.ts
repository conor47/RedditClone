import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import Post from '../entity/Post';
import Sub from '../entity/Sub';
import auth from '../Middleware/auth';
import user from '../Middleware/user';

import sub from 'date-fns/sub';
import { Between } from 'typeorm';

const createPost = async (req: Request, res: Response) => {
  const { title, body, sub } = req.body;

  const user = res.locals.user;

  if (title === '') {
    return res.status(400).json({ title: 'Title must not be empty' });
  }

  try {
    const subRecord = await Sub.findOneOrFail({ name: sub });
    const post = new Post({ title, body, user, sub: subRecord });
    await post.save();
    return res.json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const getPosts = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const postsPerPage: number = (req.query.count || 8) as number;
  const filter = req.query.filter;
  let posts: Post[] = [];

  try {
    if (filter == 'NEW') {
      posts = await Post.find({
        order: { createdAt: 'DESC' },
        relations: ['comments', 'votes', 'sub'],
        skip: currentPage * postsPerPage,
        take: postsPerPage,
      });
    } else if (filter == 'TOP_DAY') {
      posts = await Post.find({
        // order: { createdAt: 'DESC' },
        where: {
          createdAt: Between(sub(new Date(), { days: 1 }), new Date()),
        },
        relations: ['comments', 'votes', 'sub'],
        skip: currentPage * postsPerPage,
        take: postsPerPage,
      });

      posts.sort((a, b) => b.voteScore - a.voteScore);
    } else if (filter == 'TOP_WEEK') {
      posts = await Post.find({
        order: { createdAt: 'DESC' },
        where: {
          createdAt: Between(sub(new Date(), { days: 7 }), new Date()),
        },
        relations: ['comments', 'votes', 'sub'],
        skip: currentPage * postsPerPage,
        take: postsPerPage,
      });

      posts.sort((a, b) => b.voteScore - a.voteScore);
    } else if (filter == 'TOP_MONTH') {
      posts = await Post.find({
        order: { createdAt: 'DESC' },
        where: {
          createdAt: Between(sub(new Date(), { days: 30 }), new Date()),
        },
        relations: ['comments', 'votes', 'sub'],
        skip: currentPage * postsPerPage,
        take: postsPerPage,
      });
      posts.sort((a, b) => b.voteScore - a.voteScore);
    } else if (filter == 'TOP_ALLTIME') {
      posts = await Post.find({
        order: { createdAt: 'DESC' },
        relations: ['comments', 'votes', 'sub'],
        skip: currentPage * postsPerPage,
        take: postsPerPage,
      });
      posts.sort((a, b) => b.voteScore - a.voteScore);
    }
    if (res.locals.user) {
      posts.forEach((post) => post.setUserVote(res.locals.user));
    }
    return res.json(posts);
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Something went wrong' });
  }
};

const getPost = async (req: Request, res: Response) => {
  const { identifier, slug } = req.params;
  try {
    const post = await Post.findOneOrFail(
      { identifier, slug },
      {
        relations: ['sub', 'votes', 'comments', 'comments.votes'],
      }
    );

    if (res.locals.user) {
      post.setUserVote(res.locals.user);
    }

    return res.json(post);
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.NOT_FOUND).json({ error: 'Post not found' });
  }
};

const router = Router();
router.post('/', user, auth, createPost);
router.get('/', user, getPosts);
router.get('/:identifier/:slug', user, getPost);

export default router;
