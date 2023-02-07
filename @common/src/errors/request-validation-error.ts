import { ValidationError } from 'express-validator';
import { BaseError } from '.';

export class RequestValidationError extends BaseError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serialize() {
    return this.errors.map(err => {
      return { message: err.msg, field: err.param };
    });
  }
}
