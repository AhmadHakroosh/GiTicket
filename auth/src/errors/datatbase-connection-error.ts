import { BaseError, SerializedErrorItem } from ".";

export class DatabaseConnectionError extends BaseError {
    statusCode = 500;
    
    constructor() {
        super("Error connecting to database");
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serialize(): SerializedErrorItem[] {
        return [{ message: this.message }];
    }
}