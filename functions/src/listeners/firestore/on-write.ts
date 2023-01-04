import * as functions from 'firebase-functions';

import { UserModel } from '@src/models';
import type { ClaimsDocumentData } from '@src/types';
import { logs } from '@src/utils';

export const mirrorCustomClaims = functions.firestore.document('user-claims/{uid}').onWrite(async (change, context) => {
  const { uid } = context.params;
  const beforeData: ClaimsDocumentData = change.before.data() || {};
  const afterData: ClaimsDocumentData = change.after.data() || {};

  logs.startListener('mirrorCustomClaims');

  try {
    // skip updates where updatedAt field changed, to avoid infinite loops
    const skipUpdate =
      beforeData.updatedAt && afterData.updatedAt && !beforeData.updatedAt.isEqual(afterData.updatedAt);

    if (skipUpdate) {
      logs.claimsNoChanges(skipUpdate, beforeData, afterData);
      return;
    }

    UserModel.updateUserClaims(uid, afterData);
  } catch (error) {
    logs.functionExecError(error as Error);
  }
});
