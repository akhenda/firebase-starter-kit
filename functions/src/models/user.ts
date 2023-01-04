import * as admin from 'firebase-admin';
import { parsePhoneNumber } from 'libphonenumber-js';
import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator';

import { DatabaseService, Image } from '@src/services';
import type { AuthUserRecord, ServerTimestamp } from '@src/types';

const { serverTimestamp } = admin.firestore.FieldValue;

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
    l: `${image}?size=720`,
    m: `${image}?size=360`,
    s: `${image}?size=200`,
    xl: `${image}?size=1024`,
    xs: `${image}?size=100`,
    xxl: `${image}?size=1920`,
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

function getUserInfoFromAuthUser(authUser: AuthUserRecord) {
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

export class UserService extends DatabaseService<User> {
  static getRandomName() {
    return getRandomName();
  }

  static getRandomAvatar(seed: string | number | undefined) {
    return getRandomAvatarImage(seed);
  }

  static getUserInfoFromAuthUser(authUser: AuthUserRecord) {
    return getUserInfoFromAuthUser(authUser);
  }
}

export const UserModel = new UserService('users');
