import * as admin from 'firebase-admin';

import 'jest-extended';
import 'jest-extended/all';

if (!admin.apps.length) admin.initializeApp();

// https://github.com/elhamzahir/eshop/blob/9a61776478/functions/scripts/testSetup.ts
// import * as admin from 'firebase-admin';

// const projectId = 'unit-test-project';
// const { FIREBASE_DATABASE_EMULATOR_HOST, FIRESTORE_EMULATOR_HOST = 'localhost:8080' } = process.env;

// // Prevents warning from firebase-admin saying that project is being inferred from GCLOUD_PROJECT
// process.env.FIREBASE_CONFIG = JSON.stringify({
//   databaseURL: `https://${projectId}.firebaseio.com`,
//   projectId,
//   // Can not be emulator
//   storageBucket: `${projectId}.appspot.com`,
// });
// (global as any).projectId = projectId;

// // Initialize admin SDK with emulator settings for RTDB (needed to
// // prevent error from initializeApp not being called since it is in index.js)
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   databaseURL: `http://${FIREBASE_DATABASE_EMULATOR_HOST}?ns=${projectId}`,
//   projectId,
// });

// // Initialize Firestore with emulator settings from environment
// const [servicePath, portStr] = FIRESTORE_EMULATOR_HOST.split(':');
// admin.firestore().settings({
//   port: parseInt(portStr, 10),
//   servicePath,
// });
