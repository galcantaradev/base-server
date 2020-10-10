import { Field, ObjectType } from 'type-graphql';

import { FieldError } from './FieldError';

@ObjectType()
export class Response {
  @Field(_type => [FieldError], { nullable: true })
  errors?: FieldError[];
}
