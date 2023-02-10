import { Listener, OrderStatus, PaymentCreatedEventData, Queue, Subject } from "@giticket.dev/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models";

export class PaymentCreatedListener extends Listener<Subject.PaymentCreated, PaymentCreatedEventData> {
    readonly subject: Subject.PaymentCreated = Subject.PaymentCreated;
    queueGroup: Queue = Queue.Payments;

    async onMessage(data: PaymentCreatedEventData, message: Message): Promise<void> {
        const order = await Order.findById(data.orderId);

        if (!order) {
            throw new Error("Order was not found");
        }

        order.set({ status: OrderStatus.Complete });

        await order.save();

        message.ack();
    }
}