import http from 'http';

import type { HostAndPort } from '@firebase/rules-unit-testing';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment as _initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { setLogLevel } from 'firebase/firestore';
import { createWriteStream, readFileSync } from 'fs-extra';
import type { IncomingMessage } from 'http';

let testEnv: RulesTestEnvironment;

export const initializeTestEnvironment = async () => {
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
  testEnv = await _initializeTestEnvironment({
    firestore: {
      rules: readFileSync('../firestore.rules', 'utf8'),
    },
  });
};

export const getTestEnv = () => testEnv;

export const beforeAllTests = async () => {
  // Silence expected rules rejections from Firestore SDK. Unexpected rejections
  // will still bubble up and will be thrown as an error (failing the tests).
  setLogLevel('error');

  await initializeTestEnvironment();
};

export const afterAllTests = async () => {
  if (getTestEnv()) {
    // Delete all the FirebaseApp instances created during testing.
    // Note: this does not affect or clear any data.
    await getTestEnv().cleanup();

    // Write the coverage report to a file
    const coverageFile = 'firestore-coverage.html';
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const fstream = createWriteStream(coverageFile);
    await new Promise((resolve, reject) => {
      const { host, port } = getTestEnv().emulators.firestore as HostAndPort;
      const quotedHost = host.includes(':') ? `[${host}]` : host;
      http.get(
        `http://${quotedHost}:${port}/emulator/v1/projects/${getTestEnv().projectId}:ruleCoverage.html`,
        (res: IncomingMessage) => {
          res.pipe(fstream, { end: true });
          res.on('end', resolve);
          res.on('error', reject);
        },
      );
    });

    // eslint-disable-next-line no-console
    console.log(`View firestore rule coverage information at ${coverageFile}\n`);
  }
};

// If you want to define global variables for Rules Test Contexts to save some
// typing, make sure to initialize them for *every test* to avoid cache issues.
//
//     let unauthedDb;
//     beforeEach(() => {
//       unauthedDb = getTestEnv().unauthenticatedContext().database();
//     });
//
// Or you can just create them inline to make tests self-contained like below.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let unauthedDb: any;
export const beforeEachTest = async () => {
  await getTestEnv().clearFirestore();

  unauthedDb = getTestEnv().unauthenticatedContext().firestore();
};

export const getUnauthedDb = () => unauthedDb;

export { assertFails, assertSucceeds };
