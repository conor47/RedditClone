import { Exclude, instanceToPlain } from 'class-transformer';
import bcrypt from 'bcrypt';
import {
  Entity as ToEntity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import Entity from './Entity';
import User from './User';
import { makeId, slugify } from '../Utils/helpers';
import Post from './Post';

@ToEntity('subs')
export default class Sub extends Entity {
  constructor(post: Partial<Sub>) {
    super();
    Object.assign(this, post);
  }

  @Index()
  @Column({ unique: true })
  name: string;

  @Index()
  @Column({ type: 'text' })
  title: string;

  @Index()
  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  imageUrn: string;

  @Column({ nullable: true })
  bannerUrn: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @OneToMany(() => Post, (post) => post.sub)
  posts: Post[];
}
