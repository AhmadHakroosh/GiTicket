import { NextFunction, Request, Response } from "express";
import { BaseError } from "../errors";

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if(err instanceof BaseError) {
        return res.status(err.statusCode).send({ errors: err.serialize() });
    }

    res.status(400).send({
        errors: [{ message: err.message }]
    });
};