/* eslint-disable jest/no-export */
export default () => {
  describe('Storage', () => {
    it.todo('onProfilePicUpload => when an object that is not an image is uploaded, ignore it and exit');

    it.todo('onProfilePicUpload => when an object does not have a name/filePath, ignore it and exit');

    it.todo("onProfilePicUpload => when an object's root path is not 'users', ignore it and exit");

    it.todo('onProfilePicUpload => when an object does not have a user UID, ignore it and exit');

    it.todo('onProfilePicUpload => when an object has a thumbnail path, ignore it and exit');

    it.todo('onProfilePicUpload => when an object is not a profile image upload, ignore it and exit');

    it.todo('onProfilePicUpload => when a profile image is uploaded, update the user doc');
  });
};
