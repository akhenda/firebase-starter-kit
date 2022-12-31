import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { sum } from '@src/utils/sum';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((_, response) => {
  functions.logger.info('Hello logs!', { structuredData: true, sum: sum(1, 2, 3, 4) });
  response.send(`Hello from Firebase! ${sum(1, 2, 3, 4, 2)}`);
});

if (!admin.apps.length) admin.initializeApp();

/**
 * Auth Listeners Functions
 */
export * from './auth';
