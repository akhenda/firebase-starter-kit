import * as admin from 'firebase-admin';

export interface ImageThumbnails {
  xs?: string; // 100x100
  s?: string; // 200x200
  m?: string; // 360x360
  l?: string; // 720x720
  xl?: string; // 1024x1024
  xxl?: string; // 1920x1920
}

export interface Image extends ImageThumbnails {
  full: string;
}

function getNewFileName(size: string, fileName?: string) {
  if (!fileName) return '';

  const fileNameSplit = fileName.split('.');

  return fileNameSplit
    .map((e, i) => {
      if (fileNameSplit.length - 2 === i) return `${e}${size}`;

      return fileNameSplit.length - 1 === i ? 'webp' : e;
    })
    .join('.');
}

function getThumbnail(size: string, filePath?: string) {
  if (!filePath) return '';

  const filePathSplit = filePath.split('/');
  const fileName = filePathSplit.slice(-1).pop();

  return filePathSplit.map((e, i) => (filePathSplit.length - 1 === i ? getNewFileName(size, fileName) : e)).join('/');
}

/**
 * Get Thumbnails created by the resize images firebase extension
 * e.g. users/a4935c06-7f0c-52b7-882e-3a403c2af646/ProfilePhotos/3.jpg
 *
 * will give
 *
 * {
 *  xs: 'users/c65ee30e-ed9a-511c-ad9d-45f98e8d8fd6/ProfilePhotos/3_100x100.webp',
 *  s: 'users/c65ee30e-ed9a-511c-ad9d-45f98e8d8fd6/ProfilePhotos/3_200x200.webp',
 *  m: 'users/c65ee30e-ed9a-511c-ad9d-45f98e8d8fd6/ProfilePhotos/3_360x360.webp',
 *  l: 'users/c65ee30e-ed9a-511c-ad9d-45f98e8d8fd6/ProfilePhotos/3_720x720.webp',
 *  xl: 'users/c65ee30e-ed9a-511c-ad9d-45f98e8d8fd6/ProfilePhotos/3_1024x1024.webp',
 *  xxl: 'users/c65ee30e-ed9a-511c-ad9d-45f98e8d8fd6/ProfilePhotos/3_1920x1920.webp'
 * }
 * @param filePath string
 * @returns ImageThumbnails
 */
export function getThumbsFromFilePath(filePath: string): ImageThumbnails {
  return {
    l: getThumbnail('_720x720', filePath),
    m: getThumbnail('_360x360', filePath),
    s: getThumbnail('_200x200', filePath),
    xl: getThumbnail('_1024x1024', filePath),
    xs: getThumbnail('_100x100', filePath),
    xxl: getThumbnail('_1920x1920', filePath),
  };
}

export const storage = admin.storage();
export const bucket = storage.bucket('hc-starter-kits.appspot.com');

export class StorageService {}
