import { AuthService } from '@src/services';
import type { AuthUserRecordUpdate, DocumentData } from '@src/types';

export function generateAuthUserFromDocData(data: DocumentData): AuthUserRecordUpdate {
  const updatePayload = {} as AuthUserRecordUpdate;

  // disable phone number updating for now
  // if (data.phoneNumber) updatePayload.phoneNumber = data.phoneNumber;
  if (data.email) updatePayload.email = data.email;
  if (data.photo) updatePayload.photoURL = data.photo?.full || data.photo;

  updatePayload.displayName =
    `${data.firstName || ''} ${data.lastName || ''}`.trim() ||
    `${data.displayName || ''}`.trim() ||
    `${data.name || ''}`.trim();

  return updatePayload;
}

export class AuthSchema extends AuthService {
  async updateAuthUserFromUserProfileData(uid: string, data: DocumentData) {
    const updatePayload = generateAuthUserFromDocData(data);

    await this.updateUser(uid, updatePayload);
  }
}

export const AuthModel = new AuthSchema();
