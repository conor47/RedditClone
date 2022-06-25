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
} from 'typeorm';

import Entity from './Entity';

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
  bodu: string;

  @Column()
  subName: string;
}
