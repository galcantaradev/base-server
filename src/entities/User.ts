import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field(_type => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(_type => String)
  @Column({ type: 'text' })
  name: string;

  @Field(_type => String)
  @Column({ unique: true })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Field(_type => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(_type => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
