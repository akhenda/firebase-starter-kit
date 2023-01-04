import * as admin from 'firebase-admin';
import { add, all, collection, get, remove, set, update, value } from 'typesaurus';
import type { AddModel } from 'typesaurus/add';

export const db = admin.firestore();

export abstract class DatabaseService<T> {
  collection;

  /**
   * Specify 'users', 'categories', 'books' or any name as collection name
   *
   * @param collectionName {string} The name of the collection to work with
   */
  constructor(collectionName: string) {
    this.collection = collection<T>(collectionName);
  }

  /**
   * Returns list of documents as an array of javascript objects
   *
   * @returns {array} The list/array of documents you requested
   */
  async getAll() {
    const docs = await all(this.collection);

    return docs;
  }

  /**
   * Returns a single document in object format
   *
   * @param id {string} The ID of the document to fetch
   * @returns {object|null} The found document
   */
  async getOne(id?: string) {
    if (!id) return null; // entity form is in create mode

    const doc = await get(this.collection, id);

    return doc;
  }

  /**
   * Save a new document in the database
   *
   * @param data {object} The new data to save/create
   * @param id {string} The id of the document if we want it to have a specific ID
   * @returns {object} The created/saved document
   */
  async create(data: AddModel<T>, id?: string) {
    const values = {
      ...data,
      createdAt: value('serverDate'),
      updatedAt: value('serverDate'),
    };

    const doc = id ? await set(this.collection, id, values) : await add(this.collection, values);

    return doc;
  }

  /**
   * Update an existing document with new data.
   *
   * When just the doc id is passed, we only update the updatedAt field.
   * We need this at times to force rgeneration of a firebase's user IdToken
   * when we update the user doc.
   *
   * @param id {string} The ID of the document
   * @param values {object} The data to update. Can be an empty object to only
   * update the updatedAt field
   * @returns {object} The updated document
   */
  async update(id: string, values: Partial<T> = {}) {
    const doc = await update(this.collection, id, { ...values, updatedAt: value('serverDate') });

    return doc;
  }

  /**
   * Delete an existing document from the collection
   *
   * @param id {string} The ID of the document to delete
   */
  async remove(id: string) {
    await remove(this.collection, id);
  }
}
