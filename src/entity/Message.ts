import {
  Column,
  Entity as TOEntity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import Entity from './Entity';
import User from './User';

@TOEntity('messages')
export default class Message extends Entity {
  constructor(message: Partial<Message>) {
    super();
    Object.assign(this, message);
  }

  @Column()
  body: string;

  @Column()
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  from: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  to: User;
}
