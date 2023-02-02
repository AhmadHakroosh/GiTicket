import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.use(json());

// Setup routes
app.use("/api/users", currentUserRouter);
app.use("/api/users", signinRouter);
app.use("/api/users", signupRouter);
app.use("/api/users", signoutRouter);

app.all("*", async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

const bootstrap = async () => {
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
