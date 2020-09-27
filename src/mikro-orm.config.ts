import { MikroORM } from '@mikro-orm/core';
import path from 'path';

import { __PROD__ } from './constants';

export default {
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[tj]s$/
  },
  entities: ['./dist/entities'],
  entitiesTs: ['./src/entities'],
  dbName: 'base',
  type: 'postgresql',
  debug: !__PROD__,
  password: 'postgres'
} as Parameters<typeof MikroORM.init>[0];
