import { expressMiddleware } from '@apollo/server/express4';
import { errorReporter } from 'express-youch';

import { createApp } from '@src/listeners/servers/config';

import api from './api-routes';
import graphQLServer from './graphql';

const app = createApp();

app.use('/api', api);
app.use(errorReporter());

export async function initGraphQLServer() {
  // Ensure we wait for our GraphQL server to start
  await graphQLServer.start();

  // Set up our Express middleware to handle Apollo's expressMiddleware function.
  app.use('/graphql', expressMiddleware(graphQLServer));
}

initGraphQLServer();

export default app;
