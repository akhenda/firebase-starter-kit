import * as admin from 'firebase-admin';

import { logs } from '@src/utils';

if (!admin.apps.length) admin.initializeApp();

logs.init();

export const auth = admin.auth();
export const db = admin.firestore();
