import * as functions from 'firebase-functions';

import { UserClaimModel, UserModel } from '@src/models';
import { bucket } from '@src/services';
import { logs } from '@src/utils';

export const authOnDelete = functions.auth.user().onDelete(async (user) => {
  logs.deletingUserDocs(user);

  await UserModel.remove(user.uid);
  await UserClaimModel.remove(user.uid);
  await bucket.deleteFiles({ force: true, prefix: `users/${user.uid}` });

  logs.allUserFilesDeleted(user);
});
