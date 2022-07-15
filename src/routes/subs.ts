import { isEmpty } from 'class-validator';
import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import Post from '../entity/Post';
import Sub from '../entity/Sub';
import multer from 'multer';
import path from 'path';

import User from '../entity/User';
import { BadRequestError, NotFoundError } from '../errors';
import auth from '../Middleware/auth';
import user from '../Middleware/user';
import { makeId } from '../Utils/helpers';
import { NextFunction } from 'express-serve-static-core';
import Unauthorized from '../errors/Unauthorized';

const createSub = async (req: Request, res: Response) => {
  const { name, title, description } = req.body;

  const user: User = res.locals.user;

  try {
    let errors: { [key: string]: string } = {};

    if (isEmpty(name)) errors.name = 'Name must not be empty';
    if (isEmpty(title)) errors.title = 'Title must not be empty';

    const sub = await getRepository(Sub)
      .createQueryBuilder('sub')
      .where('lower(sub.name) = :name', { name: name.toLowerCase() })
      .getOne();

    if (sub) errors.name = 'Sub exists already';

    if (Object.keys(errors).length > 0) {
      throw errors;
    }
  } catch (error) {
    return res.status(400).json(error);
  }

  try {
    const sub = new Sub({ name, description, title, user });
    await sub.save();
    return res.json(sub);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const getSub = async (req: Request, res: Response) => {
  let { name } = req.params;
  name = name.toLowerCase();
  try {
    const sub = await Sub.findOneOrFail({ name });
    const posts = await Post.find({
      where: { sub },
      order: { createdAt: 'DESC' },
      relations: ['comments', 'votes'],
    });

    sub.posts = posts;

    if (res.locals.user) {
      sub.posts.forEach((post) => post.setUserVote(res.locals.user));
    }

    return res.json(sub);
  } catch (error) {
    console.log(error);
    throw new NotFoundError('Sub not found');
  }
};

// middleware to check that the user trying to upload an image owns the sub
const ownSub = async (req: Request, res: Response, next: NextFunction) => {
  const user: User = res.locals.user;

  try {
    const sub = await Sub.findOneOrFail({ name: req.params.name });

    if (sub.username !== user.username) {
      throw new Unauthorized('You are not authorized');
    } else {
      res.locals.sub = sub;
      return next();
    }
  } catch (error) {
    console.log(error);
    throw new BadRequestError('Something went wrong');
  }
};

// multer middleware for handling file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: 'public/images',
    filename: (_, file, callback) => {
      const name = makeId(15);
      callback(null, name + path.extname(file.originalname));
    },
  }),
  fileFilter: (_, file, callback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      callback(null, true);
    } else {
      callback(new Error('Not an image'));
    }
  },
});

const uploadSubImage = async (req: Request, res: Response) => {
  return res.json({ success: true });
};

const router = Router();
router.post('/', user, auth, createSub);
router.get('/:name', user, getSub);
router.post(
  '/:name/image',
  user,
  auth,
  ownSub,
  upload.single('file'),
  uploadSubImage
);

export default router;
