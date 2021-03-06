import { Request, Response } from 'express';
import { Redis } from 'ioredis';

export type BaseContext = {
  req: Request;
  res: Response;
  redis: Redis;
};
