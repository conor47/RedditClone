import e, { Router } from 'express';
import { Request, Response } from 'express-serve-static-core';
import Comment from '../entity/Comment';
import Post from '../entity/Post';
import User from '../entity/User';
import Vote from '../entity/Vote';
import { BadRequestError } from '../errors';
import auth from '../Middleware/auth';

const router = Router();

const vote = async (req: Request, res: Response) => {
  const { identifier, slug, commentIdentifier, value } = req.body;

  //validate the value
  if (![-1, 0, 1].includes(value)) {
    throw new BadRequestError('Invalid vote value');
  }

  try {
    const user :User= res.locals.user
    let post = await Post.findOneOrFail({identifier,slug})
    let vote:Vote|undefined 
    let comment:Comment|undefined

    if(commentIdentifier){
        comment = await Comment.findOneOrFail({identifier:commentIdentifier})
        vote = await Vote.findOneOrFail({user,comment})
    } else {

        vote = await Vote.findOneOrFail({user,post})
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({error:'Something went wrong'})
};

router.post('/vote', auth, vote);

export default router;
