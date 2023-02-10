import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, currentUser } from "@giticket.dev/common";
import { CreatePaymentRouter } from "./routes";

const app = express();
app.set('trust-proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test" && process.env.NODE_ENV !== "development"
}));
app.use(currentUser);

// Setup routes
app.use(CreatePaymentRouter);

app.all("*", async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };