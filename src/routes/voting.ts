import e, { Router } from 'express';
import { Request, Response } from 'express-serve-static-core';
import { BaseEntity } from 'typeorm';
import Comment from '../entity/Comment';
import Post from '../entity/Post';
import User from '../entity/User';
import Vote from '../entity/Vote';
import { BadRequestError } from '../errors';
import auth from '../Middleware/auth';
import { createVotesTable1657576902658 } from '../migration/1657576902658-create-votes-table';

const vote = async (req: Request, res: Response) => {
  const { identifier, slug, commentIdentifier, value } = req.body;

  //validate the value
  if (![-1, 0, 1].includes(value)) {
    throw new BadRequestError('Invalid vote value');
  }

  try {
    const user: User = res.locals.user;
    let post = await Post.findOneOrFail({ identifier, slug });
    let vote: Vote | undefined;
    let comment: Comment | undefined;

    if (commentIdentifier) {
      // find the comment and find the vote by this user on that comment if one exists
      comment = await Comment.findOneOrFail({ identifier: commentIdentifier });
      vote = await Vote.findOne({ user, comment });
    } else {
      // The vote is for a post. Find the vote by the user on the post if ones exists
      vote = await Vote.findOne({ user, post });
    }

    if (!vote && value === 0) {
      throw new BadRequestError('Vote not found');
    } else if (!vote) {
      // the value is not 0 and there is no vote. We must create the vote
      vote = new Vote({ user, value });
      // if this vote is a on a comment then add the comment
      if (comment) {
        vote.comment = comment;
        // else this vote is on a post. Add the post
      } else {
        vote.post = post;
      }
      await vote.save();
    } else if (value === 0) {
      // vote exists and value === 0. Remove vote from database
      await vote.remove();
    } else if (vote.value !== value) {
      // vote exists and the value has changed .Update the value
      vote.value = value;
      await vote.save();
    }

    post = await Post.findOneOrFail(
      { identifier, slug },
      { relations: ['comments', 'sub', 'votes'] }
    );

    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
const router = Router();

router.post('/vote', auth, vote);

export default router;
