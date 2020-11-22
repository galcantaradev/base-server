import { ConnectionOptions } from 'typeorm';
import {
  DATABASE_URL,
  POSTGRES_DB,
  POSTGRES_PASSWORD,
  POSTGRES_USER
} from './constants';
import { User } from './entities';

export default {
  type: 'postgres',
  database: POSTGRES_DB,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  url: DATABASE_URL,
  logging: true,
  synchronize: true,
  entities: [User]
} as ConnectionOptions;
