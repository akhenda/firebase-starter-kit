import * as functions from 'firebase-functions';

import { UserModel } from '@src/models';
import { bucket, getThumbsFromFilePath, Image } from '@src/services/Storage';
import { logs } from '@src/utils';

export const onProfilePicUpload = functions
  .region('europe-west2')
  .storage.bucket('hc-starter-kits.appspot.com')
  .object()
  .onFinalize(async (object) => {
    logs.startListener('onUserUpdate');

    const { name: filePath, contentType } = object;

    // exit if this is triggered on a file that is not an image.
    if (contentType && !contentType.startsWith('image/')) return logs.notAnImage();

    // exit if we don't have the filePath.
    if (!filePath) return logs.filePathMissing();

    try {
      const file = filePath ? filePath.split('/') : [];

      // get the file name.
      const [rootPath, userUID] = file;
      const fileName = file[file.length - 1];

      // exit if root path is not 'users'.
      if (rootPath !== 'users') return logs.notAUserUpload();

      // exit if we don't have the userUID.
      if (!userUID || userUID === fileName) return logs.userUIDMissing();

      // exit if this is triggered on a file that is auto-generated.
      if (file.some((e) => e.toLowerCase().includes('thumbs'))) return logs.anAutoGeneratedImage();

      // exit if this is not a profile image upload.
      if (!file.some((e) => e.toLowerCase().includes('profilephotos'))) return logs.notProfileImageUpload();

      const userPhoto: Image = {
        ...getThumbsFromFilePath(filePath),
        full: filePath,
      };

      await Promise.all(
        Object.entries(userPhoto).map(async ([key, item]: [string, string]) => {
          const photo = bucket.file(item);
          let [photoURL] = await photo.getSignedUrl({ action: 'read', expires: '03-09-2491' });

          // we need this for local testing
          if (object.mediaLink?.includes('localhost')) photoURL = object.mediaLink;

          userPhoto[key as keyof Image] = photoURL;
        }),
      );

      logs.uploadedImage({
        file,
        fileName,
        object,
        userPhoto,
        userUID,
      });

      await UserModel.update(userUID, { photo: userPhoto });

      return await Promise.resolve();
    } catch (error) {
      logs.functionExecError(error as Error);
      return Promise.reject(error);
    }
  });
