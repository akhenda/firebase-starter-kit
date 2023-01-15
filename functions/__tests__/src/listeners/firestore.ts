import { FirebaseEmulator } from '@tests/__utils__/emulator';
import Chance from 'chance';

import { mirrorCustomClaims, onUserUpdate } from '@src/listeners/firestore';
import type { User } from '@src/models';
import { fromMillis, serverTimestamp } from '@src/utils';

const chance = new Chance();

const firebase = new FirebaseEmulator();
const { wrap, mocks, test, firestore: db } = firebase;
const { mockConsoleWarn, mockUpdateUser, mockSetCustomUserClaims } = mocks();

// eslint-disable-next-line jest/no-export
export default () => {
  describe('Firestore', () => {
    beforeEach(() => {
      mockUpdateUser.mockClear();
      mockSetCustomUserClaims.mockClear();
      mockConsoleWarn.mockClear();
    });

    afterAll(() => {
      test.cleanup();
    });

    it('when a user document is updated, also update the auth records', async () => {
      const wrapped = wrap(onUserUpdate);

      // Make a fake user
      const uid = chance.guid();
      const email = chance.email();
      const name = chance.name();
      const phone = chance.phone();
      const photo = chance.avatar({ fileExtension: 'jpg', protocol: 'https' });

      // Make a fake user document snapshots to pass to the function
      const beforeSnap = test.firestore.makeDocumentSnapshot({ email, name, phone, photo }, `/users/${uid}`);
      const afterSnap = test.firestore.makeDocumentSnapshot({ email, name: 'John Doe', phone, photo }, `/users/${uid}`);

      const change = test.makeChange(beforeSnap, afterSnap);

      // Call the wrapped onUserUpdate function
      await wrapped(change, { params: { uid } });

      expect(mockUpdateUser).toHaveBeenNthCalledWith(1, uid, {
        displayName: 'John Doe',
        email,
        photoURL: photo,
      });
    });

    it("when a user-claim doc is updated, update the user's auth claims and refresh the user's token", async () => {
      const wrapped = test.wrap(mirrorCustomClaims);

      // Make a fake user profile and a user-claims doc
      const uid = chance.guid();
      const email = chance.email();
      const name = chance.name();
      const phone = chance.phone();
      const photo = chance.avatar({ fileExtension: 'jpg', protocol: 'https' });
      const userClaims = { manager: true, updatedAt: serverTimestamp() };
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

      const userRef = db.collection('users').doc(uid);
      const userClaimsRef = db.collection('user-claims').doc(uid);

      await userRef.set(user);
      await userClaimsRef.set(userClaims);

      const userSnap = await db.collection('users').doc(uid).get();
      const userClaimsSnap = await db.collection('user-claims').doc(uid).get();
      const userSnapData = userSnap.data();
      const userClaimsSnapData = userClaimsSnap.data();

      // verify we have a user in the db and their corresponding claims doc
      expect(userSnap.exists).toBeTrue();
      expect(userClaimsSnap.exists).toBeTrue();
      expect(userSnap.id).toEqual(uid);
      expect(userClaimsSnap.id).toEqual(uid);
      expect(userSnapData?.email).toEqual(email);
      expect(userClaimsSnapData?.manager).toBeTrue();
      expect(userClaimsSnapData?.admin).toBeUndefined();

      // set new claims
      const userClaimsBeforeSnap = userClaimsSnap;
      const userClaimsAfterSnap = test.firestore.makeDocumentSnapshot(
        { admin: true, manager: false },
        `/user-claims/${uid}`,
      );

      // Call the wrapped mirrorCustomClaims function with the change
      // this should update the user claims and update the refresh token date
      const change = test.makeChange(userClaimsBeforeSnap, userClaimsAfterSnap);
      await wrapped(change, { params: { uid } });

      // Check to see if claims & user refresh token date have updated
      const userSnap2 = await userRef.get();
      const userClaimsSnap2 = await userClaimsRef.get();

      expect(userSnap2.exists).toBeTrue();
      expect(userClaimsSnap2.exists).toBeTrue();

      const userSnap2Data = userSnap2.data();
      const userClaimsSnap2Data = userClaimsSnap2.data();

      expect(userSnap2Data?.updatedAt).toBeTruthy();
      expect(userClaimsSnap2Data?.admin).toBeTrue();
      expect(userClaimsSnap2Data?.manager).toBeFalse();

      expect(mockSetCustomUserClaims).toHaveBeenNthCalledWith(1, uid, { admin: true, manager: false });
    });

    it('when a user-claim doc is updated, and the updatedAt field changed skip updates to avoid infinite loops', async () => {
      const wrapped = test.wrap(mirrorCustomClaims);

      const uid = chance.guid();
      const userClaimsBeforeSnap = test.firestore.makeDocumentSnapshot(
        { admin: true, manager: false, updatedAt: fromMillis(1633904756000) },
        `/user-claims/${uid}`,
      );
      const userClaimsAfterSnap = test.firestore.makeDocumentSnapshot(
        { admin: true, manager: false, updatedAt: fromMillis(1633884756000) },
        `/user-claims/${uid}`,
      );

      // Call the wrapped mirrorCustomClaims function with the change
      // this should NOT update the user claims because updatedAt is
      // undefined in both snapshots hence similar
      const change = test.makeChange(userClaimsBeforeSnap, userClaimsAfterSnap);
      await wrapped(change, { params: { uid } });

      expect(mockSetCustomUserClaims).not.toHaveBeenCalled();
      expect(mockConsoleWarn).toHaveBeenCalledTimes(1);
      expect(mockConsoleWarn).toMatchSnapshot();
    });
  });
};
