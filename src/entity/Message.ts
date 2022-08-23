import {
  Column,
  Entity as TOEntity,
  Index,
  JoinColumn,
  ManyToOne,
  Unique,
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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  creatorId: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  recipientName: User;
}
