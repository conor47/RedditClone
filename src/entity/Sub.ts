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
import { Exclude, Expose } from 'class-transformer';
import Subscription from './Subscriptions';
import { sub } from 'date-fns';

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
  publicId: string;

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
      ? this.imageUrn
      : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
  }

  @Expose()
  get bannerUrl(): string | undefined {
    return this.bannerUrn ? this.bannerUrn : undefined;
  }

  @OneToMany(() => Post, (post) => post.sub)
  posts: Post[];

  @Exclude()
  @OneToMany(() => Subscription, (subscription) => subscription.sub)
  subscriptions: Subscription[];

  protected isSubscribed: boolean;
  setIsSubscribed(user: User) {
    console.log('user', user);
    console.log('this', this);

    this.isSubscribed = this.subscriptions?.find((subscription) => {
      console.log('subscription', subscription);

      return subscription.user.id == user.id;
    })
      ? true
      : false;
  }

  protected subCount: number;
  setSubCount() {
    this.subCount = this.subscriptions?.reduce((acc, cur) => {
      return this.id == cur.sub.id ? acc + 1 : acc;
    }, 0);
  }
}
