import camelcaseKeys from 'camelcase-keys';
import type { NextFunction, Request, Response } from 'express';
import type { auth as Auth } from 'firebase-admin';
import * as admin from 'firebase-admin';
import omitEmpty from 'omit-empty';

import { errorPayload } from '@src/listeners/servers/config/payloads';
import { ExtendableError } from '@src/utils';

const { auth } = admin;

// the 405 handler
export const methodNotAllowed = (_: Request, res: Response): void => {
  res.status(405).send('Method Not Allowed');
};

// camelcase middleware
export const camelcase = () => {
  // https://zellwk.com/blog/express-middlewares/
  return (req: Request, _: Response, next: NextFunction): void => {
    req.body = camelcaseKeys(req.body, { deep: true });
    req.params = camelcaseKeys(req.params);
    req.query = camelcaseKeys(req.query);

    next();
  };
};

// remove empty object properties middleware
export const removeEmptyProperties = () => {
  // https://zellwk.com/blog/express-middlewares/
  return (req: Request, _: Response, next: NextFunction): void => {
    req.body = omitEmpty(req.body);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.params = omitEmpty(req.params);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.query = omitEmpty(req.query);

    next();
  };
};

// https://www.toptal.com/firebase/role-based-firebase-authentication
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  const unauthorizedCode = 401;
  const unauthorizedError = errorPayload(unauthorizedCode, 'You are unauthorized');

  if (!authorization) return res.status(unauthorizedCode).send(unauthorizedError);
  if (!authorization.startsWith('Bearer')) {
    return res.status(unauthorizedCode).send(unauthorizedError);
  }

  const split = authorization.split('Bearer ');

  if (split.length !== 2) return res.status(unauthorizedCode).send(unauthorizedError);

  const [, token = ''] = authorization.split('Bearer ');

  try {
    const decodedToken: Auth.DecodedIdToken = await auth().verifyIdToken(token);

    console.log('decodedToken', JSON.stringify(decodedToken));

    res.locals = {
      ...res.locals,
      email: decodedToken.email,
      role: decodedToken.role,
      uid: decodedToken.uid,
    };

    return next();
  } catch (error: unknown) {
    if (error instanceof ExtendableError) {
      console.error(`${error.code} -  ${error.message}`);
    }

    return res.status(401).send(unauthorizedError);
  }
};

export function isAuthorized(opts: { hasRole: Array<'admin' | 'manager' | 'user'>; allowSameUser?: boolean }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { role, uid } = res.locals;
    const { id } = req.params;
    const forbiddenCode = 401;
    const forbiddenError = errorPayload(forbiddenCode, 'You do not have permission to view this resource');

    if (opts.allowSameUser && id && uid === id) return next();
    if (!role) return res.status(403).send(forbiddenError);
    if (opts.hasRole.includes(role)) return next();

    return res.status(403).send(forbiddenError);
  };
}
