import { IsEmail, MinLength } from 'class-validator';
import { Exclude, instanceToPlain } from 'class-transformer';
import bcrypt from 'bcrypt';
import {
  Entity as ToEntity,
  Column,
  BeforeRemove,
  BeforeInsert,
  OneToMany,
} from 'typeorm';

import Entity from './Entity';
import Post from './Post';

@ToEntity('users')
export default class User extends Entity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ unique: true })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  username: string;

  @Exclude()
  @Column()
  @MinLength(6, { message: 'Password must be at least 6 characaters long' })
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }
}
