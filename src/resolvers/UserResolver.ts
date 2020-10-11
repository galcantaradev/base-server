import argon2 from 'argon2';
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver
} from 'type-graphql';

import { BaseContext, FieldError, Response } from '../common';
import { COOKIE_NAME } from '../constants';
import { User } from '../entities';
import { yupErrorToFieldErrors } from '../utils';
import { UserValidationSchema } from '../validations';

@InputType()
class UserRegisterInput {
  @Field(_type => String)
  name: string;

  @Field(_type => String)
  email: string;

  @Field(_type => String)
  password: string;

  @Field(_type => String)
  passwordConfirmation: string;
}

@InputType()
class UserLoginInput {
  @Field(_type => String)
  email: string;

  @Field(_type => String)
  password: string;
}

@ObjectType()
class UserResponse extends Response {
  @Field(_type => User, { nullable: true })
  user?: User;
}

@ObjectType()
@Resolver()
export class UserResolver {
  @Mutation(_type => UserResponse)
  async register(
    @Arg('options', _type => UserRegisterInput) options: UserRegisterInput,
    @Ctx() { em }: BaseContext
  ): Promise<UserResponse> {
    try {
      await UserValidationSchema.register.validate(options, {
        abortEarly: false
      });
    } catch (error) {
      const errors = yupErrorToFieldErrors(error);

      return {
        errors
      };
    }

    const emailExists = await em.findOne(User, { email: options.email });

    if (emailExists) {
      return {
        errors: [new FieldError('email', 'email already exists')]
      };
    }

    const hashedPassword = await argon2.hash(options.password);

    const user = await em.create(User, {
      name: options.name,
      email: options.email,
      password: hashedPassword
    });

    await em.persistAndFlush(user);

    return {
      user
    };
  }

  @Mutation(_type => UserResponse)
  async login(
    @Arg('options', _type => UserLoginInput) options: UserLoginInput,
    @Ctx() { em, req }: BaseContext
  ): Promise<UserResponse> {
    try {
      await UserValidationSchema.login.validate(options, {
        abortEarly: false
      });
    } catch (error) {
      const errors = yupErrorToFieldErrors(error);

      return {
        errors
      };
    }

    const user = await em.findOne(User, { email: options.email });

    if (!user) {
      return {
        errors: [new FieldError('email', 'email is incorrect')]
      };
    }

    const validPassword = await argon2.verify(user.password, options.password);

    if (!validPassword) {
      return {
        errors: [new FieldError('password', 'password is incorrect')]
      };
    }

    /*
     * Store the user id in session:
     *
     * this will set a cookie for the users
     * keep them logged in
     */
    req.session!.userId = user.id;

    return {
      user
    };
  }

  @Mutation(_type => Boolean)
  async logout(@Ctx() { req, res }: BaseContext): Promise<boolean> {
    return new Promise(resolve => {
      req.session?.destroy(err => {
        res.clearCookie(COOKIE_NAME);

        if (err) {
          resolve(false);
          return;
        }

        resolve(true);
      });
    });
  }

  @Query(_type => User, { nullable: true })
  async me(@Ctx() { em, req }: BaseContext): Promise<User | null> {
    const userId = req.session?.userId;

    // not logged in
    if (!userId) {
      return null;
    }

    const user = await em.findOne(User, { id: userId });

    return user;
  }
}
