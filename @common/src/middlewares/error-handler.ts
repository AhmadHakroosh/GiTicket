import { Request, Response, NextFunction } from 'express';

import { BaseError } from '../errors/base-error';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof BaseError) {
    return res.status(err.statusCode).send({ errors: err.serialize() });
  }

  res.status(400).send({
    errors: [{ message: err.message }]
  });
};

export { errorHandler };
