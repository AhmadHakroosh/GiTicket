import { ValidationError } from "express-validator";
import { BaseError, SerializedErrorItem } from "./base-error";

export class RequestValidationError extends BaseError {
    statusCode = 400;

    constructor(public errors: ValidationError[]) {
        super("Invalid request parameters");
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serialize(): SerializedErrorItem[] {
        return this.errors.map(error => {
            return {
                message: error.msg,
                field: error.param
            }
        });
    }
}