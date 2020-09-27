import connectRedis from 'connect-redis';
import session from 'express-session';

import { __PROD__, SESSION_SECRET } from './constants';
import { redisClient } from './redis.config';

export const RedisStore = connectRedis(session);

export default session({
  name: 'qid',
  store: new RedisStore({
    client: redisClient,
    disableTouch: true
  }),
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: __PROD__, // only works with https
    sameSite: 'lax', // csrf
    maxAge: 1000 * 60 * 60 * 24 * 365 * 10 // 10 years
  },
  secret: SESSION_SECRET,
  resave: false
});
