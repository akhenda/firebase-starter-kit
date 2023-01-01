/* eslint-disable max-classes-per-file */
import isFunction from 'lodash/isFunction';

// https://medium.com/firebase-tips-tricks/how-to-create-an-admin-module-for-managing-users-access-and-roles-34a94cf31a6e
export class ExtendableError extends Error {
  readonly type: string;

  readonly code: number;

  readonly status: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.type = this.constructor.name;
    this.code = 500;
    this.status = 500;

    if (isFunction(Error.captureStackTrace)) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}

export class UnauthenticatedError extends ExtendableError {
  readonly code: number;

  readonly status: number;

  constructor(message = 'You are not authenticated!') {
    super(message);

    this.code = 401;
    this.status = 401;
  }
}

export class ForbiddenError extends ExtendableError {
  readonly code: number;

  readonly status: number;

  constructor(message = 'Forbidden!') {
    super(message);

    this.code = 403;
    this.status = 403;
  }
}

export class InvalidRoleError extends ExtendableError {
  readonly code: number;

  readonly status: number;

  constructor(message = 'Invalid Role!') {
    super(message);

    this.code = 403;
    this.status = 403;
  }
}
