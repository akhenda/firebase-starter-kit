import * as admin from 'firebase-admin';
import { add, all, collection, get, remove, set, update } from 'typesaurus';
import type { AddModel } from 'typesaurus/add';

export const db = admin.firestore();

export class DatabaseService<T> {
  collection;

  // Specify 'authors', 'categories', or 'books' as collection name
  constructor(collectionName: string) {
    this.collection = collection<T>(collectionName);
  }

  // returns list of records as an array of javascript objects
  async getAll() {
    const docs = await all(this.collection);

    return docs;
  }

  // returns a single document in object format
  async getOne(id?: string) {
    if (!id) return null; // entity form is in create mode

    const doc = await get(this.collection, id);

    return doc;
  }

  // save a new document in the database
  async create(data: AddModel<T>, id?: string) {
    const doc = id ? await set(this.collection, id, data) : await add(this.collection, data);

    return doc;
  }

  // update an existing document with new data
  async update(id: string, values: Partial<T>) {
    const doc = await update(this.collection, id, values);

    return doc;
  }

  // delete an existing document from the collection
  async remove(id: string) {
    await remove(this.collection, id);
  }
}
