import 'reflect-metadata';

import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import { buildSchema } from 'type-graphql';

import { BaseContext } from './common';
import { PORT } from './constants';
import { UserResolver } from './resolvers';
import sessionConfig from './session.config';
import { redis } from './redis.config';

import { createConnection } from 'typeorm';
import typeormConfig from './typeorm.config';

const main = async () => {
  await createConnection(typeormConfig);

  const app = express();

  app.use(
    cors({
      credentials: true,
      origin: 'http://localhost:3000'
    })
  );
  app.use(sessionConfig);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false
    }),
    context: ({ req, res }): BaseContext => ({ req, res, redis })
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(PORT, () => console.log(`Server started on localhost:${PORT}`));
};

main().catch(err => console.error(err));
