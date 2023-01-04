/* eslint-disable no-console */
import type { UserRecord } from 'firebase-admin/auth';
import { logger } from 'firebase-functions';

import Config from '@src/config';
import type { User } from '@src/models/user';

export const log = logger.info;
export const logE = logger.error;
export const logW = logger.warn;

export const log2JSON = (msg: string, data: Record<string | number | symbol, unknown>) => {
  console.log(msg, JSON.stringify(data, null, 2));
};

export const obfuscatedConfig = {
  ...Config,
  secretKey: '<omitted>',
};

export const init = () => {
  logger.log('Initializing functions with configuration', obfuscatedConfig);
};

export const initError = (err: Error) => {
  logger.error('Error when initializing functions', err);
};

export const functionExecError = (err: Error) => {
  logger.error('Error executing function', err);
};

export const startListener = (name: string) => {
  logger.log(`Started execution of '${name}' function`);
};

export function completeListener(name: string) {
  logger.log(`Completed execution of function ${name}`);
}

export const createdUserProfile = (user: User) => {
  logger.log('UserData => ', user);
};

export const setClaims = (user: UserRecord) => {
  logger.log(`Custom claims set for user => ${user.uid}`);
};

export const setClaimsError = (user: UserRecord, err: Error) => {
  logger.error(`Unable to set custom claims on user => ${user.uid}`, err);
};

export const creatingUserDoc = (user: UserRecord) => {
  logger.log(`Creating document for user => ${user.uid}`, user);
};

export const deletingUserDocs = (user: UserRecord) => {
  logger.log(`Deleting documents for user => ${user.uid}`);
};

export const allUserFilesDeleted = (user: UserRecord) => {
  logger.log(`All the Firebase Storage files in users/${user.uid} have been deleted`);
};
