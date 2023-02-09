import { ExpirationCompleteEventData, Listener, OrderStatus, Queue, Subject } from "@giticket.dev/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models";
import { OrderCancelledPublisher } from "../publishers";
import { EventBus } from "../../event-bus";

export class ExpirationCompleteListener extends Listener<Subject.ExpirationComplete, ExpirationCompleteEventData> {
    readonly subject: Subject.ExpirationComplete = Subject.ExpirationComplete;
    queueGroup: Queue = Queue.Orders;

    async onMessage(data: ExpirationCompleteEventData, message: Message): Promise<void> {
        const order = await Order.findById(data.orderId).populate("ticket");

        if (!order) {
            throw new Error("Order was not found");
        }

        order.set({ status: OrderStatus.Cancelled });
        await order.save();

        await new OrderCancelledPublisher(EventBus.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        });

        message.ack();
    }
}