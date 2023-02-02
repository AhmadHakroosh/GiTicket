import { BaseError, SerializedErrorItem } from "./base-error";

export class BadRequestError extends BaseError {
    statusCode = 400;

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serialize(): SerializedErrorItem[] {
        return [{ message: this.message }];
    }
}