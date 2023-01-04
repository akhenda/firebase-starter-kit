import * as functions from 'firebase-functions';

import { AuthModel, UserModel } from '@src/models';
import { logs } from '@src/utils';

export const onUserUpdate = functions.firestore.document('users/{uid}').onUpdate(async (change, context) => {
  const { uid } = context.params;

  logs.startListener('onUserUpdate');

  try {
    const data = change.after.data();
    await AuthModel.updateAuthUserFromUserProfileData(uid, data);
  } catch (error) {
    // if we run into an error, revert back to the previous version
    // it will be probably because we are trying to update a with
    // a phoneNumber that is already being used
    await UserModel.revertUserDocUpdate(uid, change);
    logs.functionExecError(error as Error);
  }
});
