import { parsePhoneNumber } from 'libphonenumber-js';
import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator';

import { bucket, DatabaseService, Image } from '@src/services';
import type { AuthUserRecord, CustomClaims, QueryChange, ServerTimestamp } from '@src/types';
import { logs, serverTimestamp } from '@src/utils';

import { AuthModel } from './auth';
import { UserClaimModel } from './user-claim';

export interface UserFullName {
  first: string;
  last: string;
}

export interface User {
  name: UserFullName;
  username?: string | null;
  email?: string;
  phone?: string;
  createdAt: ServerTimestamp;
  updatedAt: ServerTimestamp;
  photo: Image;
}

function getRandomName() {
  return uniqueNamesGenerator({
    dictionaries: [colors, animals],
    length: 2,
    separator: ' ',
    style: 'capital',
  });
}

function getImage(image: string): Image {
  return {
    full: image,
    l: image ? `${image}?size=720` : '',
    m: image ? `${image}?size=360` : '',
    s: image ? `${image}?size=200` : '',
    xl: image ? `${image}?size=1024` : '',
    xs: image ? `${image}?size=100` : '',
    xxl: image ? `${image}?size=1920` : '',
  };
}

function getRandomAvatar(seed: string | number | undefined) {
  let finalSeed = String(seed) || Date.now().toString();

  finalSeed = finalSeed.split(' ').join('-');

  const avatar = `https://avatars.dicebear.com/api/adventurer-neutral/${finalSeed}.svg`;

  return avatar;
}

function getRandomAvatarImage(seed: string | number | undefined): Image {
  return getImage(getRandomAvatar(seed));
}

function generateUserProfileFromAuthUser(authUser: AuthUserRecord) {
  const { displayName, email, phoneNumber, photoURL } = authUser;

  const name = displayName?.split(' ') || [];
  const data = {
    createdAt: serverTimestamp(),
    email,
    name: { first: name[0] || '', last: name[1] || '' },
    phone: phoneNumber ? parsePhoneNumber(phoneNumber, 'KE').formatNational() : undefined,
    photo: photoURL
      ? getImage(photoURL)
      : getRandomAvatarImage(`${displayName || 'anonymous'}-${phoneNumber || email}`),
    updatedAt: serverTimestamp(),
    username: null,
  } satisfies User;

  return data;
}

export class UserSchema extends DatabaseService<User> {
  static getRandomName() {
    return getRandomName();
  }

  static getRandomAvatar(seed: string | number | undefined) {
    return getRandomAvatarImage(seed);
  }

  static generateUserProfileFromAuthUser(authUser: AuthUserRecord) {
    return generateUserProfileFromAuthUser(authUser);
  }

  async updateUserClaims(uid: string, data: CustomClaims) {
    // Create a new JSON payload and check that it's under the 1000 character max
    const claims = await AuthModel.updateCustomClaims(uid, data);

    if (!claims) return;

    logs.updatingDocTimestamps();

    await UserClaimModel.update(uid, claims);

    logs.forceRefreshUserIdToken(uid);

    await this.update(uid);
  }

  async createUserProfile(user: AuthUserRecord, customClaims?: CustomClaims) {
    const initialCustomClaims = customClaims || {};
    const data = generateUserProfileFromAuthUser(user);

    logs.createdUserProfile(data);

    await AuthModel.setCustomUserClaims(user.uid, initialCustomClaims);

    logs.creatingUserDoc(user);

    await this.create(data, user.uid);

    // also update the auth user photoURL
    if (data.photo.full) await AuthModel.updateUser(user.uid, { photoURL: data.photo.full }, data);
  }

  async createAdminProfile(user: AuthUserRecord) {
    await this.createUserProfile(user, { admin: true });
  }

  async revertUserDocUpdate(uid: string, change: QueryChange) {
    const data = change.before.data();

    logs.userUpdateRevert(uid, data);

    await this.update(uid, data);
  }

  async deleteUserData(user: AuthUserRecord) {
    logs.deletingUserDocs(user);

    await this.remove(user.uid);
    await UserClaimModel.remove(user.uid);
    await bucket.deleteFiles({ force: true, prefix: `users/${user.uid}` });

    logs.allUserFilesDeleted(user);
  }
}

export const UserModel = new UserSchema('users');
