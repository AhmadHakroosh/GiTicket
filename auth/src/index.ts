import mongoose from "mongoose";

import { app } from "./app";

const bootstrap = async () => {
    if(!process.env.JWT_KEY) {
        throw new Error("JWT_KEY must be defined");
    }

    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
        console.log("Connected to MongoDB");
    } catch(err) {
        console.error(err);
    }

    app.listen(3000, () => {
        console.log("App listening on port 3000!");
    });
};

bootstrap();
