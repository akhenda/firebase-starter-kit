import * as functions from 'firebase-functions';

import { UserClaimModel, UserModel } from '@src/models';
import { bucket } from '@src/services';
import { log } from '@src/utils';

export const authOnDelete = functions.auth.user().onDelete(async (user) => {
  log(`Deleting documents for user => ${user.uid}`);

  await UserModel.remove(user.uid);
  await UserClaimModel.remove(user.uid);
  await bucket.deleteFiles({ force: true, prefix: `users/${user.uid}` });

  log(`All the Firebase Storage files in users/${user.uid} have been deleted`);
});
