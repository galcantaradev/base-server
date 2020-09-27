import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import { Request, Response } from 'express';

export type BaseContext = {
  req: Request;
  res: Response;
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
};
