/* eslint-disable jest/expect-expect */
import { assertFails, assertSucceeds, getTestEnv, getUnauthedDb } from '@tests/__utils__/rules';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

// eslint-disable-next-line jest/no-export
export default () => {
  describe('Public user profiles', () => {
    it('should not let just anyone read any profile', async () => {
      // Setup: Create documents in DB for testing (bypassing Security Rules).
      await getTestEnv().withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'users/foobar'), { foo: 'bar' });
      });

      // Then test security rules by trying to read it using the client SDK.
      await assertFails(getDoc(doc(getUnauthedDb(), 'users/foobar')));
    });

    it('should not allow users to read from a random collection', async () => {
      await assertFails(getDoc(doc(getUnauthedDb(), 'foo/bar')));
    });

    it('should allow ONLY signed in users to create their own profile with required `createdAt` field', async () => {
      const aliceDb = getTestEnv().authenticatedContext('alice').firestore();

      await assertSucceeds(
        setDoc(doc(aliceDb, 'users/alice'), {
          birthday: 'January 1',
          createdAt: serverTimestamp(),
        }),
      );

      // Signed in user with required fields for others' profile
      await assertFails(
        setDoc(doc(aliceDb, 'users/bob'), {
          birthday: 'January 1',
          createdAt: serverTimestamp(),
        }),
      );

      // Signed in user without required fields
      await assertFails(
        setDoc(doc(aliceDb, 'users/alice'), {
          birthday: 'January 1',
        }),
      );
    });
  });
  describe('Private user notifications', () => {
    it('should not let just anyone read any notifications', async () => {
      // Setup: Create documents in DB for testing (bypassing Security Rules).
      await getTestEnv().withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'users/foobar/notifications/test'), { foo: 'bar' });
      });

      // Then test security rules by trying to read it using the client SDK.
      await assertFails(getDoc(doc(getUnauthedDb(), 'users/foobar/notifications/test')));
    });

    it('should allow users to only read their notifications', async () => {
      const joeDb = getTestEnv().authenticatedContext('joe').firestore();

      await getTestEnv().withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), 'users/joe/notifications/test'), { foo: 'bar' });
      });

      await assertSucceeds(getDoc(doc(joeDb, 'users/joe/notifications/test')));
    });
  });
};
