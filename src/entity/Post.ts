import { Exclude, instanceToPlain } from 'class-transformer';
import bcrypt from 'bcrypt';
import {
  Entity as ToEntity,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Entity from './Entity';
import User from './User';

@ToEntity('posts')
export default class Post extends Entity {
  constructor(post: Partial<Post>) {
    super();
    Object.assign(this, post);
  }

  @Index()
  @Column()
  identifier: string;

  @Column()
  title: string;

  @Index()
  @Column()
  slug: string;

  @Column({ nullable: true, type: 'text' })
  body: string;

  @Column()
  subName: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;
}
