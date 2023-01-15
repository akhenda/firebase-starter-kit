import path from 'path';

import { FirebaseEmulator } from '@tests/__utils__/emulator';

import { authOnCreate, authOnDelete } from '@src/listeners/auth';
import type { User } from '@src/models';
import { serverTimestamp } from '@src/utils';

const firebase = new FirebaseEmulator();
const { firestore: db, makeUserRecord, wrap, storage, mocks } = firebase;
const { mockConsoleLog, mockSetCustomUserClaims } = mocks();

// eslint-disable-next-line jest/no-export
export default function authTests() {
  describe('Auth', () => {
    beforeEach(() => {
      mockConsoleLog.mockClear();
    });

    it('when a user signs up, a user profile is created in firestore', async () => {
      const wrapped = wrap(authOnCreate);

      // Make a fake user to pass to the function
      const uid = '1T2E3S4T5U6S7E8R';
      const email = `user-${uid}@example.com`;
      const displayName = 'Test User';
      const phoneNumber = '0720 123456';
      const photoURL = 'https://placeimg.com/640/480/people';
      const user = makeUserRecord({
        displayName,
        email,
        phoneNumber,
        photoURL,
        uid,
      });

      // Call the wrapped auth.onCreate function
      await wrapped(user);

      expect(mockConsoleLog).toHaveBeenCalledTimes(5);
      expect(mockConsoleLog).toMatchSnapshot();

      // Check the data was written to the Firestore emulator
      const snap = await db.collection('users').doc(uid).get();
      const data = snap.data() as User | undefined;

      expect(data?.createdAt).toBeTruthy();
      expect(snap.id).toEqual(uid);
      expect(data?.email).toEqual(email);
      expect(data?.name.first).toEqual('Test');
      expect(data?.name.last).toEqual('User');
      expect(data?.phone).toEqual(phoneNumber);
      expect(data?.photo.full).toEqual(photoURL);

      expect(mockSetCustomUserClaims).toHaveBeenCalledTimes(1);
      expect(mockSetCustomUserClaims).toHaveBeenCalledWith(uid, {});
    });

    it('when a user is deleted, all related firestore docs and storage items are deleted', async () => {
      const wrapped = wrap(authOnDelete);

      // Make a fake user profile and a user-claims doc
      const uid = 'test-user';
      const userClaims = { user: true };
      const user = {
        createdAt: serverTimestamp(),
        email: `user-${uid}@example.com`,
        name: {
          first: 'Test',
          last: 'User',
        },
        phone: '0720 123456',
        photo: { full: 'https://placeimg.com/640/480/people' },
        updatedAt: serverTimestamp(),
      } satisfies User;

      const userRef = db.collection('users').doc(uid);
      const userClaimsRef = db.collection('user-claims').doc(uid);

      await userRef.set(user);
      await userClaimsRef.set(userClaims);

      const userSnap = await db.collection('users').doc(uid).get();
      const userClaimsSnap = await db.collection('user-claims').doc(uid).get();
      const userSnapData = userSnap.data() as User | undefined;
      const userClaimsSnapData = userClaimsSnap.data();

      // verify we have a user in the db and their corresponding claims doc
      expect(userSnap.exists).toBeTrue();
      expect(userClaimsSnap.exists).toBeTrue();
      expect(userSnap.id).toEqual(uid);
      expect(userClaimsSnap.id).toEqual(uid);
      expect(userSnapData?.name.first).toEqual('Test');
      expect(userSnapData?.name.last).toEqual('User');
      expect(userSnapData?.email).toEqual(`user-${uid}@example.com`);
      expect(userClaimsSnapData?.user).toBeTrue();

      // create files for user in storage
      const bucket = storage.bucket('hc-starter-kits.appspot.com');
      await bucket.upload(path.join(__dirname, './samples/_test-storage.txt'), {
        destination: `users/${uid}/test-file.md`,
        metadata: {
          contentType: 'text/markdown',
        },
      });

      // expect the created file to exist
      expect((await bucket.file(`users/${uid}/test-file.md`).exists())[0]).toBeTrue();

      // Call the wrapped auth.onDelete function with test user uid
      // this should delete all user docs and files in storage
      await wrapped(makeUserRecord({ uid }));

      expect(mockConsoleLog).toHaveBeenCalledTimes(3);

      // expect the created file not to exist
      expect((await bucket.file(`users/${uid}/test-file.md`).exists())[0]).toBeFalse();

      // Check that data is deleted
      const userSnap2 = await userRef.get();
      const userClaimsSnap2 = await userClaimsRef.get();

      expect(userSnap2.exists).toBeFalse();
      expect(userClaimsSnap2.exists).toBeFalse();

      const userSnap2Data = userSnap2.data();
      const userClaimsSnap2Data = userClaimsSnap2.data();

      expect(userSnap2Data?.email).toBeUndefined();
      expect(userClaimsSnap2Data?.user).toBeUndefined();
    });
  });
}
