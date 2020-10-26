import { ConnectionOptions } from 'typeorm';
import { User } from './entities';

export default {
  type: 'postgres',
  database: 'base',
  username: 'postgres',
  password: 'postgres',
  logging: true,
  synchronize: true,
  entities: [User]
} as ConnectionOptions;
