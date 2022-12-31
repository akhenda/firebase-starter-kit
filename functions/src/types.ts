import type { app, auth, firestore } from 'firebase-admin';

export type App = app.App;
export type Auth = auth.Auth;
export type Firestore = firestore.Firestore;
export type DocumentReference = firestore.DocumentReference;
export type CollectionReference = firestore.CollectionReference;
export type Query = firestore.Query;
export type DocumentSnapshot = firestore.DocumentSnapshot;
export type QuerySnapshot = firestore.QuerySnapshot;
export type QueryDocumentSnapshot = firestore.QueryDocumentSnapshot;
export type FirestoreTimestamp = firestore.Timestamp;
export type ServerTimestamp = ReturnType<typeof firestore.FieldValue.serverTimestamp>;
export type AuthUserRecord = auth.UserRecord;
