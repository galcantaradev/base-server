import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';

import { Timestamps } from './Timestamps';

@Entity()
@ObjectType()
export class User extends Timestamps {
  @Field(_type => String)
  @PrimaryKey({ type: 'uuid', defaultRaw: 'uuid_generate_v4()' })
  id: string;

  @Field(_type => String)
  @Property({ type: 'text' })
  name: string;

  @Field(_type => String)
  @Property({ type: 'text', unique: true })
  email: string;

  @Property({ type: 'text' })
  password: string;
}
