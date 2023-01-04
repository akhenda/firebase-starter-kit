/* eslint-disable jest/valid-describe-callback */
/* eslint-disable import/first */
// import { init } from '@tests/__utils__/setup';

// import setupEnvironment from '@tests/__utils__/setupEnv';
import authTests from './auth';
import firestoreTests from './firestore';
import serversTests from './servers';
import storageTests from './storage';

describe('Firebase Functions Unit Tests', () => {
  // beforeAll(beforeAllTests);

  // afterAll(afterAllTests);

  // beforeEach(beforeEachTest);

  authTests();
  firestoreTests();
  serversTests();
  storageTests();
});
