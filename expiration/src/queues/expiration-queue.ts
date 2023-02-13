import Queue, { Queue as BullQueue } from "bull";
import { ExpirationCompletePublisher } from "../events/publishers";
import { EventBus } from "../event-bus";

interface Order {
    orderId: string;
};

const publisher = new ExpirationCompletePublisher(EventBus.client);

const worker = async (job: { data: Order }) => {
    await publisher.publish({
        orderId: job.data.orderId
    });
};

class ExpirationQueue {
    static #queue: BullQueue<Order>;

    private constructor() {
        ExpirationQueue.#queue = new Queue<Order>("order-expiration", {
            redis: {
                host: process.env.REDIS_HOST,
                port: Number(process.env.REDIS_PORT || 6379)
            }
        });

        ExpirationQueue.#queue.process(worker);
    }

    public static getQueue(): BullQueue<Order> {
        if(!this.#queue) {
            new ExpirationQueue();
        }

        return this.#queue;
    }
}

export { ExpirationQueue, worker, publisher, Order };