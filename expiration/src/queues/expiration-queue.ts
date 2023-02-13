import Queue, { Queue as BullQueue } from "bull";
import { ExpirationCompletePublisher } from "../events/publishers";
import { EventBus } from "../event-bus";

interface Order {
    orderId: string;
};

const publisher = new ExpirationCompletePublisher(EventBus.client);

const worker = async (job: { data: Order }) => {
    console.log("hello world")
    await publisher.publish({
        orderId: job.data.orderId
    });
};

const expirationQueue: BullQueue<Order> = new Queue<Order>("order-expiration", {
    redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT || 6379)
    }
});

expirationQueue.process(worker);

export { expirationQueue, worker, publisher, Order };