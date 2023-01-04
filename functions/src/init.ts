import * as admin from 'firebase-admin';

import * as logs from '@utils/logs';

if (!admin.apps.length) admin.initializeApp();

logs.init();

export const auth = admin.auth();
export const db = admin.firestore();
