import { NODE_ENV } from './env';

export * from './env';

export const IS_DEV = NODE_ENV === 'development';
