import * as functions from 'firebase-functions';

import { UserModel, UserService } from '@src/models';
import { auth } from '@src/services';
import { log, logE } from '@src/utils';

export const authOnCreate = functions.auth.user().onCreate(async (user) => {
  try {
    const data = UserService.getUserInfoFromAuthUser(user);

    log('UserData => ', data);

    await auth
      .setCustomUserClaims(user.uid, {})
      .then(() => log(`Custom claims set for user => ${user.uid}`))
      .catch((err) => {
        logE(`Unable to set custom claims on user => ${user.uid}`, err);
        throw new Error(err);
      });

    log(`Creating document for user => ${user.uid}`);

    await UserModel.create(data, user.uid);

    // also update the auth user photoURL
    if (data.photo.full) auth.updateUser(user.uid, { photoURL: data.photo.full });

    return await Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
});
