import * as functions from 'firebase-functions';

import { UserModel, UserService } from '@src/models';
import { auth } from '@src/services';
import { logs } from '@src/utils';

export const authOnCreate = functions.auth.user().onCreate(async (user) => {
  logs.startListener('authOnCreate');

  try {
    const data = UserService.getUserInfoFromAuthUser(user);

    logs.createdUserProfile(data);

    await auth
      .setCustomUserClaims(user.uid, {})
      .then(() => logs.setClaims(user))
      .catch((error: unknown) => {
        logs.setClaimsError(user, error as Error);
        throw error;
      });

    logs.creatingUserDoc(user);

    await UserModel.create(data, user.uid);

    // also update the auth user photoURL
    if (data.photo.full) await auth.updateUser(user.uid, { photoURL: data.photo.full });
  } catch (error) {
    logs.functionExecError(error as Error);
  }
});
