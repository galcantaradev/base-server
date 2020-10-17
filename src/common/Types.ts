import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import { Request, Response } from 'express';
import { Redis } from 'ioredis';

export type BaseContext = {
  req: Request;
  res: Response;
  redis: Redis;
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
};
