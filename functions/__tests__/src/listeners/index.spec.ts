import authTests from './auth';
import firestoreTests from './firestore';
import serversTests from './servers';
import storageTests from './storage';

describe('Firebase Functions Unit Tests', () => {
  authTests();
  firestoreTests();
  serversTests();
  storageTests();
});
