import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Types } from "mongoose";
import jwt from "jsonwebtoken";

declare global {
    var signin: () => string[];
}

let mongo: MongoMemoryServer;

beforeAll(async () => {
    process.env.JWT_KEY = "testEnvironemntJWTKey";

    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    mongoose.set('strictQuery', false);

    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }

    await mongoose.connection.close();
});

global.signin = () => {
    // Build a JWT payload, i.e. { id, email }
    const payload = {
        id: new Types.ObjectId().toHexString(),
        email: "test@test.com"
    };

    // Create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build a session object, i.e. { jwt: <MY_JWT> }
    const session = { jwt: token };

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Turn the JSON into base64
    const base64 = Buffer.from(sessionJSON).toString("base64");

    // Return a string that's the cookie with the encoded data
    return [`session=${base64}`];
}