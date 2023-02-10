import { Listener, OrderCancelledEventData, OrderCreatedEventData, OrderStatus, Queue, Subject } from "@giticket.dev/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models";

export class OrderCancelledListener extends Listener<Subject.OrderCancelled, OrderCancelledEventData> {
    readonly subject: Subject.OrderCancelled = Subject.OrderCancelled;
    queueGroup: Queue = Queue.Payments;

    async onMessage(data: OrderCancelledEventData, message: Message): Promise<void> {
        const order = await Order.findByEvent(data);

        if (!order) {
            throw new Error("Order was not found");
        }

        order.set({ status: OrderStatus.Cancelled });

        await order.save();

        message.ack();
    }
}