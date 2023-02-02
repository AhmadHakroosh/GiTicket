import { Model, Schema, model } from "mongoose";
import { Password } from "../services/password";

/**
 * An interface that describes the properties
 * required to create a new user instance 
 */
interface UserProperties {
    email: string;
    password: string;
}

/**
 * An interface that describes the properties
 * a User Model has
 */
interface UserDocument extends Document {
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * A mongoDB schema that describes the properties
 * that defined what a user is
 */
const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

UserSchema.pre('save', async function(done) {
    if(this.isModified('password')) {
        const hashed = await Password.hash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

const UserModel = model<UserDocument, Model<UserDocument>>("User", UserSchema);

export class User extends UserModel {
    constructor(user: UserProperties) {
        super(new UserModel(user));
    }
};