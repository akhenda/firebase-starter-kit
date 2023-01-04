import type { app, auth, firestore } from 'firebase-admin';
import type functions from 'firebase-functions';

export type App = app.App;
export type Auth = auth.Auth;
export type Firestore = firestore.Firestore;
export type DocumentReference = firestore.DocumentReference;
export type CollectionReference = firestore.CollectionReference;
export type Query = firestore.Query;
export type DocumentSnapshot = firestore.DocumentSnapshot;
export type DocumentData = firestore.DocumentData;
export type QuerySnapshot = firestore.QuerySnapshot;
export type QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;
export type FirestoreTimestamp = firestore.Timestamp;
export type ServerTimestamp = ReturnType<typeof firestore.FieldValue.serverTimestamp>;
export type AuthUserRecord = auth.UserRecord;
export type AuthUserRecordUpdate = auth.UpdateRequest;
export type QueryChange = functions.Change<functions.firestore.QueryDocumentSnapshot>;
export type DocChange = functions.Change<functions.firestore.DocumentSnapshot>;

// https://stackoverflow.com/a/43001581
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };
export type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };

export type CustomClaims = Record<string, string | boolean>;
export interface ClaimsDocumentData extends DocumentData {
  updatedAt?: firestore.Timestamp;
}
