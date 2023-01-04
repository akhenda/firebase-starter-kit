/* eslint-disable import/no-extraneous-dependencies */
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment as _initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { readFileSync } from 'fs-extra';

const { serverTimestamp } = FieldValue;

let testEnv: RulesTestEnvironment;

export const initializeTestEnvironment = async () => {
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
  testEnv = await _initializeTestEnvironment({
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
    },
  });
};

export const getTestEnv = () => testEnv;

export { assertFails, assertSucceeds, serverTimestamp, Timestamp };
