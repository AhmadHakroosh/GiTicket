import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { signupRouter, signinRouter, signoutRouter, currentUserRouter } from "./routes";
import { errorHandler } from "./middlewares";
import { NotFoundError } from "./errors";

const app = express();
app.set('trust-proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test" && process.env.NODE_ENV !== "development"
}));

// Setup routes
app.use("/api/users", currentUserRouter);
app.use("/api/users", signinRouter);
app.use("/api/users", signupRouter);
app.use("/api/users", signoutRouter);

app.all("*", async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };