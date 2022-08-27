import {
  Entity as ToEntity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import Entity from './Entity';
import Sub from './Sub';
import User from './User';

@ToEntity('subscriptions')
export default class Subscription extends Entity {
  constructor(subscription: Partial<Subscription>) {
    super();
    Object.assign(this, subscription);
  }

  @ManyToOne(() => Sub)
  @JoinColumn({ name: 'sub_id', referencedColumnName: 'id' })
  sub: Sub;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
