import * as functions from 'firebase-functions';

import { UserModel } from '@src/models';
import { logs } from '@src/utils';

export const authOnDelete = functions.auth.user().onDelete(async (user) => {
  logs.startListener('authOnCreate');

  try {
    await UserModel.deleteUserData(user);
  } catch (error) {
    logs.functionExecError(error as Error);
  }
});
