import * as functions from 'firebase-functions';

import { sum } from '@src/utils/sum';

export const helloWorld = functions.https.onRequest((_, response) => {
  functions.logger.info('Hello logs!', { structuredData: true, sum: sum(1, 2, 3, 4) });
  response.send(`Hello from Firebase! ${sum(1, 2, 3, 4, 2)}`);
});

/**
 * Auth Listeners Functions
 */
export * from './listeners/auth';

/**
 * Express Servers
 */
export * from './listeners/servers';
