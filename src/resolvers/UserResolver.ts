import argon2 from 'argon2';
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql';
import { v4 } from 'uuid';

import { BaseContext, FieldError, Response } from '../common';
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from '../constants';
import { User } from '../entities';
import { isAuthenticated } from '../middlewares';
import { sendEmail, yupErrorToFieldErrors } from '../utils';
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

@InputType()
class UserProfileInput {
  @Field(_type => String)
  name: string;

  @Field(_type => String, { nullable: true })
  email?: string;

  @Field(_type => String, { nullable: true })
  password?: string;
}

@InputType()
class ChangePasswordInput {
  @Field(_type => String)
  password: string;

  @Field(_type => String)
  passwordConfirmation: string;
}

@ObjectType()
class UserResponse extends Response {
  @Field(_type => User, { nullable: true })
  user?: User;
}

@Resolver()
@ObjectType()
export class UserResolver {
  @Mutation(_type => UserResponse)
  async register(
    @Arg('options', _type => UserRegisterInput) options: UserRegisterInput,
    @Ctx() { req }: BaseContext
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

    const emailExists = await User.findOne({ where: { email: options.email } });

    if (emailExists) {
      return {
        errors: [new FieldError('email', 'email already exists')]
      };
    }

    const hashedPassword = await argon2.hash(options.password);

    const user = await User.create({
      name: options.name,
      email: options.email,
      password: hashedPassword
    }).save();

    req.session!.userId = user.id;

    return {
      user
    };
  }

  @Mutation(_type => UserResponse)
  async login(
    @Arg('options', _type => UserLoginInput) options: UserLoginInput,
    @Ctx() { req }: BaseContext
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

    const user = await User.findOne({ where: { email: options.email } });

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

  @UseMiddleware(isAuthenticated)
  @Query(_type => User, { nullable: true })
  async me(@Ctx() { req }: BaseContext): Promise<User | null | undefined> {
    return User.findOne(req.session?.userId);
  }

  @UseMiddleware(isAuthenticated)
  @Mutation(_type => UserResponse, { nullable: true })
  async profile(
    @Arg('options', _type => UserProfileInput) options: UserProfileInput,
    @Ctx() { req }: BaseContext
  ): Promise<UserResponse> {
    try {
      await UserValidationSchema.profile.validate(options, {
        abortEarly: false
      });
    } catch (error) {
      const errors = yupErrorToFieldErrors(error);

      return {
        errors
      };
    }

    const user = (await User.findOne(req.session?.userId)) as User;
    const updates: Partial<User> = {};

    updates.name = options.name;

    if (options.password) {
      const hashedPassword = await argon2.hash(options.password);
      updates.password = hashedPassword;
    }

    await User.update(user.id, updates);
    const updatedUser = await User.findOne(user.id);

    return {
      user: updatedUser
    };
  }

  @Mutation(_type => Response, { nullable: true })
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { redis }: BaseContext
  ): Promise<Response | void> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return {
        errors: [new FieldError('email', "that email doesn't exist")]
      };
    }

    const token = v4();

    await redis.set(
      `${FORGET_PASSWORD_PREFIX}_${token}`,
      user.id,
      'ex',
      1000 * 60 * 60 * 24 // 1 day
    );

    await sendEmail({
      to: email,
      html: `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
    });
  }

  @Mutation(_type => UserResponse)
  async changePassword(
    @Arg('token', _type => String) token: string,
    @Arg('options', _type => ChangePasswordInput) options: ChangePasswordInput,
    @Ctx() { redis, req }: BaseContext
  ): Promise<UserResponse | void> {
    try {
      await UserValidationSchema.changePassword.validate(options, {
        abortEarly: false
      });
    } catch (error) {
      const errors = yupErrorToFieldErrors(error);

      return {
        errors
      };
    }

    const redisKey = `${FORGET_PASSWORD_PREFIX}_${token}`;
    const userId = await redis.get(redisKey);

    if (!userId) {
      return {
        errors: [new FieldError('token', 'token expired')]
      };
    }

    const user = await User.findOne(userId);

    if (!user) {
      return {
        errors: [new FieldError('token', 'user no longer exists')]
      };
    }

    const password = await argon2.hash(options.password);

    await User.update({ id: userId }, { password });

    await redis.del(redisKey);

    // log in user after change password
    req.session!.userId = user.id;

    return {
      user
    };
  }
}
