import connectRedis from 'connect-redis';
import session from 'express-session';

import { COOKIE_NAME, SESSION_SECRET, __PROD__ } from './constants';
import redis from './redis.config';

export const RedisStore = connectRedis(session);

export default session({
  name: COOKIE_NAME,
  store: new RedisStore({
    client: redis,
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
