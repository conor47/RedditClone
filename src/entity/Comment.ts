import { Exclude, Expose } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  Entity as TOEntity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { makeId } from '../Utils/helpers';
import Entity from './Entity';
import Post from './Post';
import User from './User';
import Vote from './Vote';

@TOEntity('comments')
export default class Comment extends Entity {
  constructor(comment: Partial<Comment>) {
    super();
    Object.assign(this, comment);
  }

  @Index()
  @Column()
  identifier: string;

  @Column({ nullable: true, type: 'text' })
  body: string | null;

  @Column({ nullable: true, type: 'text' })
  parentId: string | null;

  @Column({ nullable: true, type: 'text' })
  username: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User | null;

  @ManyToOne(() => Post, (post) => post.comments, { nullable: false })
  @JoinColumn({ name: 'post', referencedColumnName: 'id' })
  post: Post;

  @Exclude()
  @OneToMany(() => Vote, (vote) => vote.comment)
  votes: Vote[];

  @Expose() get voteScore(): number {
    return this.votes?.reduce((acc, cur) => {
      return acc + (cur.value || 0);
    }, 0);
  }

  protected userVote: number;
  setUserVote(user: User) {
    const index = this.votes?.findIndex((v) => v.username === user.username);
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(8);
  }
}
