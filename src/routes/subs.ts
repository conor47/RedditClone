import { IsEmpty, isEmpty } from 'class-validator';
import { Request, Response, Router } from 'express';
import { getConnection, getRepository } from 'typeorm';
import Post from '../entity/Post';
import Sub from '../entity/Sub';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

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
    // if the subs owner doesn't match the requesting user's username
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

// route for handling file upload
const uploadSubImage = async (req: Request, res: Response) => {
  const sub: Sub = res.locals.sub;
  try {
    const type = req.body.type;

    // handle invalid file types
    if (type !== 'image' && type !== 'banner') {
      // delete the uploaded file
      fs.unlinkSync(req.file!.path!);
      return res.status(400).json({ error: 'Invalid type' });
    }
    const urn = req.file!.filename;
    // use the type key in the request object to determine whether the uploaded file is for the sub image or banner
    // use oldImageUrn store the old image urn if one exists
    let oldImageUrn: string = '';
    if (type === 'image') {
      oldImageUrn = sub.imageUrn || '';
      sub.imageUrn = urn;
    } else {
      oldImageUrn = sub.bannerUrn || '';
      sub.bannerUrn = urn;
    }
    // if an old image urn exists delete it
    if (oldImageUrn !== '') {
      fs.unlinkSync(`public/images/${oldImageUrn}`);
    }

    await sub.save();
    return res.json(sub);
  } catch (error) {
    console.log(error);

    throw new BadRequestError('something went wrong');
  }
};

const topSubs = async (req: Request, res: Response) => {
  const imageUrlExp = `COALESCE('${process.env.APP_URL}/images/' || s."imageUrn" , 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y')`;
  try {
    const subs = await getConnection()
      .createQueryBuilder()
      .select(
        `s.title,s.name,${imageUrlExp} as "imageUrl",count(p.id) as "postCount"`
      )
      .from(Sub, 's')
      .leftJoin(Post, 'p', `s.name = p."subName"`)
      .groupBy('s.title,s.name,"imageUrl"')
      .orderBy(`"postCount"`, 'DESC')
      .limit(5)
      .execute();

    return res.json(subs);
  } catch (error) {
    throw new BadRequestError('Something went wrong');
  }
};

const searchSubs = async (req: Request, res: Response) => {
  const name = req.params.name;

  try {
    if (name.trim() === '') {
      return new BadRequestError('Name must not be empty');
    }

    const subs = await getRepository(Sub)
      .createQueryBuilder()
      .where('LOWER(name) LIKE :name', {
        name: `${name.toLowerCase().trim()}%`,
      })
      .getMany();

    return res.json(subs);
  } catch (error) {
    console.log(error);
    throw new BadRequestError('Something went wrong');
  }
};

const router = Router();
router.post('/', user, auth, createSub);
router.get('/topSubs', topSubs);
router.get('/:name', user, getSub);
router.get('/search/:name', searchSubs);
router.post(
  '/:name/image',
  user,
  auth,
  ownSub,
  upload.single('file'),
  uploadSubImage
);

export default router;
