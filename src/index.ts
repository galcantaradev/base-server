import 'reflect-metadata';

import { MikroORM } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { buildSchema } from 'type-graphql';

import { BaseContext } from './common';
import { PORT } from './constants';
import { UserResolver } from './resolvers';

import mikroOrmConfig from './mikro-orm.config';
import sessionConfig from './session.config';

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  await orm.getMigrator().up();

  const app = express();

  app.use(sessionConfig);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false
    }),
    context: ({ req, res }): BaseContext => ({ em: orm.em, req, res })
  });

  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () => console.log(`Server started on localhost:${PORT}`));
};

main().catch(err => console.error(err));
