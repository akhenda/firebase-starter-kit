import admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export * from './errors';
export * from './validators';

export const log = functions.logger.info;
export const logE = functions.logger.error;
export const logW = functions.logger.warn;
export const logJSON = (msg: string, data: unknown) => console.log(msg, JSON.stringify(data, null, 2));
export const { serverTimestamp } = admin.firestore.FieldValue;
export const { now, fromMillis } = admin.firestore.Timestamp;
