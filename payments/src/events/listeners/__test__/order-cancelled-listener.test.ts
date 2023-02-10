import { Types } from "mongoose";
import { OrderCancelledEventData, OrderStatus } from "@giticket.dev/common";
import { EventBus } from "../../../event-bus";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models";

const setup = async () => {
    const listener = new OrderCancelledListener(EventBus.client);

    const order = new Order({
        status: OrderStatus.Created,
        price: 45,
        userId: new Types.ObjectId().toHexString(),
        version: 0
    });

    await order.save();

    const data: OrderCancelledEventData = {
        id: new Types.ObjectId(order.id).toHexString(),
        version: 1,
        ticket: {
            id: new Types.ObjectId().toHexString()
        }
    };

    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    };

    return { listener, order, data, message };
};

it("Should not update the order status if the versions are not sequential", async () => {
    const { listener, data, message } = await setup();

    try {
        await listener.onMessage({ ...data, version: 3 }, message);
    } catch (error) {
        return;
    }

    const order = await Order.findById(data.id);

    expect(order!.status).not.toEqual(OrderStatus.Cancelled);
});

it("Should update the order status to cancelled", async () => {
    const { listener, order, data, message } = await setup();

    await listener.onMessage(data, message);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("Should ack the message", async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
});