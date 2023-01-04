import * as functions from 'firebase-functions';

import { UserModel } from '@src/models';
import { logs } from '@src/utils';

export const authOnCreate = functions.auth.user().onCreate(async (user) => {
  logs.startListener('authOnCreate');

  try {
    await UserModel.createUserProfile(user);
  } catch (error) {
    logs.functionExecError(error as Error);
  }
});
