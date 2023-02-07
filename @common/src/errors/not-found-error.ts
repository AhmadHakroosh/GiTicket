import { BaseError } from './base-error';

export class NotFoundError extends BaseError {
  statusCode = 404;

  constructor() {
    super('Not found');

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serialize() {
    return [{ message: 'Not Found' }];
  }
}
