import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { EventBus } from "../event-bus";

interface Order {
    orderId: string;
};

const expirationQueue = new Queue<Order>("order-expiration", {
    redis: {
        host: process.env.REDIS_HOST
    }
});

expirationQueue.process(async job => {
    await new ExpirationCompletePublisher(EventBus.client).publish({
        orderId: job.data.orderId
    });
});

export { expirationQueue };