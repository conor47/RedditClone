import { Entity as ToEntity, Column, ManyToOne, JoinColumn } from 'typeorm';
import Comment from './Comment';

import Entity from './Entity';
import Post from './Post';
import User from './User';

@ToEntity('votes')
export default class Vote extends Entity {
  constructor(vote: Partial<Vote>) {
    super();
    Object.assign(this, vote);
  }

  @Column()
  value: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @Column()
  username: string;

  @ManyToOne(() => Post, { onDelete: 'CASCADE' })
  post: Post;

  @ManyToOne(() => Comment, { onDelete: 'CASCADE' })
  comment: Comment;
}
