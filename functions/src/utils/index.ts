import * as admin from 'firebase-admin';

export * from './errors';
export * as logs from './logs';
export * from './validators';

export const { serverTimestamp } = admin.firestore.FieldValue;
export const { now, fromMillis } = admin.firestore.Timestamp;
