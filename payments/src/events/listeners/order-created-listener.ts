import { Listener, OrderCreatedEventData, Queue, Subject } from "@giticket.dev/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models";

export class OrderCreatedListener extends Listener<Subject.OrderCreated, OrderCreatedEventData> {
    readonly subject: Subject.OrderCreated = Subject.OrderCreated;
    queueGroup: Queue = Queue.Payments;

    async onMessage(data: OrderCreatedEventData, message: Message): Promise<void> {
        const order = new Order({
            _id: data.id,
            price: data.ticket.price,
            status: data.status,
            userId: data.userId
        });

        await order.save();

        message.ack();
    }
}