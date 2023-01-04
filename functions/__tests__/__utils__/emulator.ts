/* eslint-disable import/no-extraneous-dependencies */
import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions';
import firebaseFunctionsTest from 'firebase-functions-test';
import type { FeaturesList } from 'firebase-functions-test/lib/features';

export class FirebaseEmulator {
  static mocks() {
    const mockConsoleLog = jest.spyOn(logger, 'log').mockImplementation();
    const mockConsoleInfo = jest.spyOn(logger, 'info').mockImplementation();
    const mockConsoleError = jest.spyOn(logger, 'error').mockImplementation();

    const mockSetCustomUserClaims = jest.spyOn(admin.auth(), 'setCustomUserClaims').mockImplementation(
      () =>
        new Promise((res) => {
          res();
        }),
    );

    return { mockConsoleError, mockConsoleInfo, mockConsoleLog, mockSetCustomUserClaims };
  }

  auth: admin.auth.Auth;

  firestore: admin.firestore.Firestore;

  storage: admin.storage.Storage;

  test: FeaturesList;

  wrap: FeaturesList['wrap'];

  testAuth: FeaturesList['auth'];

  testDb: FeaturesList['firestore'];

  cleanup: FeaturesList['cleanup'];

  makeUserRecord: FeaturesList['auth']['makeUserRecord'];

  constructor() {
    if (!admin.apps.length) {
      process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

      admin.initializeApp();
    }

    this.auth = admin.auth();
    this.firestore = admin.firestore();
    this.storage = admin.storage();

    /**
     * Initialize the firebase-functions-test SDK using environment variables.
     * These variables are automatically set by firebase emulators:exec. This
     * configuration will be used to initialize the Firebase Admin SDK, so when we
     * use the Admin SDK in the tests below we can be confident it will communicate
     * with the emulators, not production.
     */
    this.test = firebaseFunctionsTest();
    this.wrap = this.test.wrap;
    this.testAuth = this.test.auth;
    this.testDb = this.test.firestore;
    this.cleanup = this.test.cleanup;
    this.makeUserRecord = this.testAuth.makeUserRecord;
  }
}
