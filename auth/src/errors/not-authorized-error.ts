import { BaseError, SerializedErrorItem } from ".";

export class NotAuthorizedError extends BaseError {
    statusCode = 401;

    constructor() {
        super("Not authorized");
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }

    serialize(): SerializedErrorItem[] {
        return [{ "message": "Not authorized" }];
    }
}