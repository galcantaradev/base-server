import { Property } from '@mikro-orm/core';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Timestamps {
  @Field(_type => String)
  @Property({ type: 'date' })
  createdAt = new Date();

  @Field(_type => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date();
}
