import mongoose from "mongoose";

import { app } from "./app";
import { EventBus } from "./event-bus";
import { ExpirationCompleteListener, TicketCreatedListener, TicketUpdatedListener } from "./events/listeners";

const bootstrap = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY must be defined");
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI must be defined");
    }

    if (!process.env.EVENT_BUS_CLUSTER_ID) {
        throw new Error("EVENT_BUS_CLUSTER_ID must be defined");
    }

    if (!process.env.EVENT_BUS_CLIENT_ID) {
        throw new Error("EVENT_BUS_CLIENT_ID must be defined");
    }

    if (!process.env.EVENT_BUS_URL) {
        throw new Error("EVENT_BUS_URL must be defined");
    }

    try {
        await EventBus.connect(process.env.EVENT_BUS_CLUSTER_ID, process.env.EVENT_BUS_CLIENT_ID, process.env.EVENT_BUS_URL);

        EventBus.client.on("close", () => {
            console.log("Event-Bus connection closed!");
            process.exit();
        });

        process.on("SIGINT", () => EventBus.client.close());
        process.on("SIGTERM", () => EventBus.client.close());

        new TicketCreatedListener(EventBus.client).listen();
        new TicketUpdatedListener(EventBus.client).listen();
        new ExpirationCompleteListener(EventBus.client).listen();

        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error(err);
    }

    app.listen(3000, () => {
        console.log("App listening on port 3000!");
    });
};

bootstrap();
