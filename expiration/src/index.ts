import { EventBus } from "./event-bus";
import { OrderCreatedListener } from "./events/listeners";

const bootstrap = async () => {
    if (!process.env.EVENT_BUS_CLUSTER_ID) {
        throw new Error("EVENT_BUS_CLUSTER_ID must be defined");
    }

    if (!process.env.EVENT_BUS_CLIENT_ID) {
        throw new Error("EVENT_BUS_CLIENT_ID must be defined");
    }

    if (!process.env.EVENT_BUS_URL) {
        throw new Error("EVENT_BUS_URL must be defined");
    }

    if (!process.env.REDIS_HOST) {
        throw new Error("REDIS_HOST must be defined");
    }

    try {
        await EventBus.connect(process.env.EVENT_BUS_CLUSTER_ID, process.env.EVENT_BUS_CLIENT_ID, process.env.EVENT_BUS_URL);

        EventBus.client.on("close", () => {
            console.log("Event-Bus connection closed!");
            process.exit();
        });

        process.on("SIGINT", () => EventBus.client.close());
        process.on("SIGTERM", () => EventBus.client.close());

        new OrderCreatedListener(EventBus.client).listen();

        console.log("Started service");

    } catch (err) {
        console.error(err);
    }
};

bootstrap();
