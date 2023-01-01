import { expressMiddleware } from '@apollo/server/express4';
import { json } from 'body-parser';
import cors from 'cors';

import { createApp } from '../config';

import api from './api-routes';
import getGraphQLServer from './graphql';

const app = createApp();

app.use('/api', api);

export async function initGraphQLServer() {
  const graphQLServer = getGraphQLServer();

  // Ensure we wait for our GraphQL server to start
  await graphQLServer.start();

  app.use('/graphql', cors(), json(), expressMiddleware(graphQLServer));
}

initGraphQLServer();

export default app;
