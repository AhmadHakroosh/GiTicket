import { BaseError, SerializedErrorItem } from ".";

export class NotFoundError extends BaseError {
    statusCode = 404;

    constructor() {
        super("Route not found");
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serialize(): SerializedErrorItem[] {
        return [{ message: "Not found" }];
    }
}