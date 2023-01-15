import { FirebaseEmulator } from '@tests/__utils__/emulator';
import Chance from 'chance';
import type { ObjectMetadata } from 'firebase-functions/v1/storage';
import type { EventContextOptions } from 'firebase-functions-test/lib/v1';

import { onProfilePicUpload } from '@src/listeners/storage';
import type { User } from '@src/models';
import { storage } from '@src/services';
import { serverTimestamp } from '@src/utils';

type FakeStorageObject = ObjectMetadata & EventContextOptions;

const chance = new Chance();
const firebase = new FirebaseEmulator();
const { wrap, firestore: db } = firebase;

/* eslint-disable jest/no-export */
export default () => {
  describe('Storage', () => {
    it('onProfilePicUpload => when an object that is not an image is uploaded, ignore it and exit', async () => {
      const wrapped = wrap(onProfilePicUpload);

      // Make a fake storage object
      const notAProfilePicObject = { contentType: 'text/html', name: '' } as FakeStorageObject;

      // Call the wrapped onProfilePicUpload function with the storage object
      const response = await wrapped(notAProfilePicObject);

      expect(response).toInclude('not an image');
    });

    it('onProfilePicUpload => when an object does not have a name/filePath, ignore it and exit', async () => {
      const wrapped = wrap(onProfilePicUpload);

      // Make fake storage object
      const noNameObject = { contentType: 'image/jpg' } as FakeStorageObject;
      const res = await wrapped(noNameObject);

      expect(res.toLowerCase()).toInclude('file path missing');
    });

    it("onProfilePicUpload => when an object's root path is not 'users', ignore it and exit", async () => {
      const wrapped = wrap(onProfilePicUpload);

      // Make fake storage object
      const notUserUploadObject = { contentType: 'image/jpg', name: 'test/users/1232/1.jpg' } as FakeStorageObject;
      const res = await wrapped(notUserUploadObject);

      expect(res.toLowerCase()).toInclude('not a user upload');
    });

    it('onProfilePicUpload => when an object does not have a user UID, ignore it and exit', async () => {
      const wrapped = wrap(onProfilePicUpload);

      // Make fake storage objects
      const noUserUIDObject = { contentType: 'image/jpg', name: 'users' } as FakeStorageObject;
      const invalidUserUIDObject = { contentType: 'image/jpg', name: 'users/1.jpg' } as FakeStorageObject;

      const res1 = await wrapped(noUserUIDObject);
      const res2 = await wrapped(invalidUserUIDObject);

      expect(res1.toLowerCase()).toInclude('user uid missing');
      expect(res2.toLowerCase()).toInclude('user uid missing');
    });

    it('onProfilePicUpload => when an object has a thumbnail path, ignore it and exit', async () => {
      const wrapped = wrap(onProfilePicUpload);

      // Make a fake storage object
      const thumbnailObject = {
        contentType: 'image/jpg',
        name: 'users/123/ProfilePhotos/thumbs/1.jpg',
      } as FakeStorageObject;

      const res = await wrapped(thumbnailObject);

      expect(res.toLowerCase()).toInclude('this is an auto-generated image');
    });

    it('onProfilePicUpload => when an object is not a profile image upload, ignore it and exit', async () => {
      const wrapped = wrap(onProfilePicUpload);

      // Make a fake storage object
      const notProfileUploadObject = {
        contentType: 'image/jpg',
        name: 'users/123/not-prof1le.jpg',
      } as FakeStorageObject;

      const res = await wrapped(notProfileUploadObject);

      expect(res.toLowerCase()).toInclude('not a profile image upload');
    });

    it('onProfilePicUpload => when a profile image is uploaded, update the user doc', async () => {
      const wrapped = wrap(onProfilePicUpload);

      // Make a fake user profile
      const uid = chance.guid();
      const email = chance.email();
      const name = chance.name();
      const phone = chance.phone();
      const photo = chance.avatar({ fileExtension: 'jpg', protocol: 'https' });
      const filePath = `users/${uid}/ProfilePhotos/3.jpg`;
      const user = {
        createdAt: serverTimestamp(),
        email,
        name: {
          first: name.split(' ')[0] || '',
          last: name.split(' ')[1] || '',
        },
        phone,
        photo: { full: photo },
        updatedAt: serverTimestamp(),
      } satisfies User;

      // set the user data in the db
      await db.collection('users').doc(uid).set(user);

      const mockStorageBucketFile = jest.spyOn(storage, 'bucket').mockImplementation(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        () =>
          ({
            file: () => ({
              getSignedUrl: () => Promise.resolve([`https://example.com/${filePath}`]),
            }),
          } as unknown as Partial<ReturnType<typeof storage.bucket>>),
      );

      // Make fake storage objects
      const profilePicObject = { contentType: 'image/jpg', name: filePath } as FakeStorageObject;

      await wrapped(profilePicObject);

      const userSnap = await db.collection('users').doc(uid).get();
      const userSnapData = userSnap.data();

      // verify we have a user in the db and their corresponding claims doc
      expect(userSnap.exists).toBeTrue();
      expect(userSnap.id).toEqual(uid);
      expect(userSnapData?.name.first).toEqual(name.split(' ')[0]);
      expect(userSnapData?.email).toEqual(email);
      expect(userSnapData?.photo.full).toEqual(`https://example.com/${filePath}`);

      expect(mockStorageBucketFile).toHaveBeenCalledTimes(7);

      mockStorageBucketFile.mockClear();
    });
  });
};
