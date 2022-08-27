import {
  Entity as ToEntity,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

import Entity from './Entity';
import User from './User';
import Post from './Post';
import { Expose } from 'class-transformer';
import Subscription from './Subscriptions';

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

  @Column()
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @Expose()
  get imageUrl(): string {
    return this.imageUrn
      ? `${process.env.APP_URL}/images/${this.imageUrn}`
      : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
  }

  @Expose()
  get bannerUrl(): string | undefined {
    return this.bannerUrn
      ? `${process.env.APP_URL}/images/${this.bannerUrn}`
      : undefined;
  }

  @OneToMany(() => Post, (post) => post.sub)
  posts: Post[];

  @OneToMany(() => Subscription, (subscription) => subscription.sub)
  subscriptions: Subscription[];
}
