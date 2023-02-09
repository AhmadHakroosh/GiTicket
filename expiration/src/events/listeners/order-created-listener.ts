import { Listener, OrderCreatedEventData, Queue, Subject } from "@giticket.dev/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues";

export class OrderCreatedListener extends Listener<Subject.OrderCreated, OrderCreatedEventData> {
    readonly subject: Subject.OrderCreated = Subject.OrderCreated;
    queueGroup: Queue = Queue.Expiration;

    async onMessage(data: OrderCreatedEventData, message: Message): Promise<void> {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        await expirationQueue.add(
            {
                orderId: data.id
            },
            { 
                delay
            }
        );
        message.ack();
    }
}