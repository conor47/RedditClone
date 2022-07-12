import { IsEmail, MinLength } from 'class-validator';
import { Exclude } from 'class-transformer';
import bcrypt from 'bcrypt';
import {
  Entity as ToEntity,
  Column,
  BeforeInsert,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import Entity from './Entity';
import Post from './Post';
import Vote from './Vote';

@ToEntity('users')
export default class User extends Entity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Column({ unique: true })
  @IsEmail(undefined, { message: 'Must be a valid email address' })
  @MinLength(1, { message: 'Email is empty' })
  email: string;

  @Column({ unique: true })
  @MinLength(3, { message: 'Must be at least 3 characters long' })
  username: string;

  @Exclude()
  @Column()
  @MinLength(6, { message: 'must be at least 6 characaters long' })
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];

  @ManyToOne(() => Vote)
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }
}
