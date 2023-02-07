import { BaseError } from './base-error';

export class DatabaseConnectionError extends BaseError {
  statusCode = 500;
  reason = 'Error connecting to Database';

  constructor() {
    super('Error connecting to Database');

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serialize() {
    return [{ message: this.reason }];
  }
}
