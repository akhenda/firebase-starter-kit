/* eslint-disable no-console */
import { logger } from 'firebase-functions';

import Config from '@src/config';
import type { User } from '@src/models/user';
import type { Image } from '@src/services/Storage';
import type { AuthUserRecord, AuthUserRecordUpdate, ClaimsDocumentData, CustomClaims, DocumentData } from '@src/types';

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

export const setUserClaims = (uid: string, customClaims: CustomClaims) => {
  logger.log(`Setting custom claims for user => ${uid}`, customClaims);
};

export const setUserClaimsError = (uid: string, customClaims: CustomClaims, error: Error) => {
  logger.error(`Unable to set custom claims on user => ${uid}`, { customClaims, error });
};

export const creatingUserDoc = (user: AuthUserRecord) => {
  logger.log(`Creating document for user => ${user.uid}`, user);
};

export const deletingUserDocs = (user: AuthUserRecord) => {
  logger.log(`Deleting documents for user => ${user.uid}`);
};

export const allUserFilesDeleted = (user: AuthUserRecord) => {
  logger.log(`All the Firebase Storage files in users/${user.uid} have been deleted`);
};

export const userUpdate = (uid: string, update: AuthUserRecordUpdate, docData?: DocumentData) => {
  logger.log('User data update => ', { docData, uid, update });
};

export const userUpdateRevert = (uid: string, docData: DocumentData) => {
  logger.log(`Reverting document update for user => ${uid}`, docData);
};

export const userUpdateError = (uid: string, error: Error, docData: DocumentData) => {
  logger.log(`Error updating user document for user => ${uid}`, { docData, error });
};

export const claimsObjectLimit = (stringifiedClaims: string) => {
  logger.warn('New custom claims object string > 1000 characters', stringifiedClaims);
};

export const claimsNoChanges = (skipUpdate: boolean, beforeData: ClaimsDocumentData, afterData: ClaimsDocumentData) => {
  logger.warn('No custom claims changes. Skipping update...', { afterData, beforeData, skipUpdate });
};

export const updatingDocTimestamps = () => {
  logger.log('Updating document(s) updatedAt timestamp(s)...');
};

export const forceRefreshUserIdToken = (uid: string) => {
  logger.log(`Force user to refresh token by updating their doc => ${uid}`);
};

export const notAnImage = () => {
  const msg = 'This is not an image.';

  logger.log(msg);

  return msg;
};

export const filePathMissing = () => {
  const msg = 'File path missing.';

  logger.log(msg);

  return msg;
};

export const notAUserUpload = () => {
  const msg = 'This is not a user upload';

  logger.log(msg);

  return msg;
};

export const userUIDMissing = () => {
  const msg = 'User UID missing.';

  logger.log(msg);

  return msg;
};

export const anAutoGeneratedImage = () => {
  const msg = 'This is an auto-generated image.';

  logger.log(msg);

  return msg;
};

export const notProfileImageUpload = () => {
  const msg = 'This is not a profile image upload.';

  logger.log(msg);

  return msg;
};

export const uploadedImage = (data: {
  file: string[];
  object: unknown;
  fileName?: string;
  userPhoto: Image;
  userUID: string;
}) => {
  const msg = 'Image uploaded successfuly ==>';

  logger.log(msg, data);

  return msg;
};
