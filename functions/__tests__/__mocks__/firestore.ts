import type { DocumentReference, Precondition, QueryDocumentSnapshot, UpdateData } from 'firebase-admin/firestore';
import functionsTestInit from 'firebase-functions-test';

export const snapshot = (input = { input: 'hello' }, path = 'translations/id1') => {
  const functionsTest = functionsTestInit();
  return functionsTest.firestore.makeDocumentSnapshot(input, path);
};

export const mockDocumentSnapshotFactory = (documentSnapshot: QueryDocumentSnapshot) => {
  return jest.fn().mockImplementation(() => {
    return {
      exists: true,
      get: documentSnapshot.get.bind(documentSnapshot),
      ref: { path: documentSnapshot.ref.path },
    };
  })();
};

export const makeChange = (before: QueryDocumentSnapshot, after: QueryDocumentSnapshot) => {
  const functionsTest = functionsTestInit();
  return functionsTest.makeChange(before, after);
};

export const mockFirestoreUpdate = jest.fn();

export const mockFirestoreTransaction = jest.fn().mockImplementation(() => {
  return (
    transactionHandler: (data: {
      update: (documentRef: DocumentReference<unknown>, data: UpdateData, precondition?: Precondition) => void;
    }) => Promise<unknown>,
  ) => {
    transactionHandler({
      update(_, field, data) {
        mockFirestoreUpdate(field, data);
      },
    });
  };
});
