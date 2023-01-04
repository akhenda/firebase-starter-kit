/* eslint-disable jest/no-export */
export default () => {
  describe('Firestore', () => {
    it.todo('when a user document is updated, also update the auth records');

    it.todo("when a user-claim doc is updated, update the user's auth claims and refresh the user's token");

    it.todo('when a user-claim doc is updated, and the updated_at field changed skip updates to avoid infinite loops');
  });
};
