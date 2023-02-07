import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, currentUser } from "@giticket.dev/common";
import { CreateTicket, GetAll, ShowTicket, UpdateTicket } from "./routes";

const app = express();
app.set('trust-proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test" && process.env.NODE_ENV !== "development"
}));
app.use(currentUser);

// Setup routes
app.use(CreateTicket);
app.use(ShowTicket);
app.use(GetAll);
app.use(UpdateTicket);

app.all("*", async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };