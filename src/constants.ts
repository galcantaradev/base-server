// application
export const COOKIE_NAME = 'qid';
export const __PROD__ = process.env.NODE_ENV === 'production';
export const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
export const SESSION_SECRET = process.env.SESSION_SECRET || 'highestintheroom';
export const FORGET_PASSWORD_PREFIX = 'forget-password';

// postgres
export const POSTGRES_PORT = process.env.POSTGRES_PORT || 5432;
export const POSTGRES_HOST = process.env.POSTGRES_PORT || 'postgres';
export const POSTGRES_USER = process.env.POSTGRES_USER || 'postgres';
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'postgres';
export const POSTGRES_DB = process.env.POSTGRES_DB || 'postgres';
export const DATABASE_URL = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;

// redis
export const REDIS_HOST = process.env.REDIS_HOST || 'redis';
export const REDIS_PORT = process.env.REDIS_PORT
  ? Number(process.env.REDIS_PORT)
  : 6379;
