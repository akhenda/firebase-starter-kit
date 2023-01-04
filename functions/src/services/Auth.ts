import * as admin from 'firebase-admin';
import omit from 'lodash/omit';

import type { AuthUserRecordUpdate, CustomClaims, DocumentData } from '@src/types';
import { logs } from '@src/utils';

export const auth = admin.auth();

export abstract class AuthService {
  auth: admin.auth.Auth;

  constructor() {
    this.auth = admin.auth();
  }

  async setCustomUserClaims(uid: string, claims: CustomClaims) {
    await this.auth
      .setCustomUserClaims(uid, claims)
      .then(() => logs.setUserClaims(uid, claims))
      .catch((error: unknown) => {
        logs.setUserClaimsError(uid, claims, error as Error);
        throw error;
      });
  }

  async updateUser(uid: string, updatePayload: AuthUserRecordUpdate, docData?: DocumentData) {
    logs.userUpdate(uid, updatePayload, docData);

    const data = await this.auth.updateUser(uid, updatePayload);

    return data;
  }

  async updateCustomClaims(uid: string, data: CustomClaims) {
    // Create a new JSON payload and check that it's under the 1000 character max
    const newClaims = omit(data, 'updatedAt');
    const stringifiedClaims = JSON.stringify(newClaims);

    if (stringifiedClaims.length > 1000) {
      logs.claimsObjectLimit(stringifiedClaims);
      return null;
    }

    await this.setCustomUserClaims(uid, newClaims);

    return newClaims;
  }
}
