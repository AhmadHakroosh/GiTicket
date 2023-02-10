import { OrderCreatedEventData, OrderStatus } from "@giticket.dev/common";
import { EventBus } from "../../../event-bus";
import { OrderCreatedListener } from "../order-created-listener";
import { Types } from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models";

const setup = async () => {
    const listener = new OrderCreatedListener(EventBus.client);

    const data: OrderCreatedEventData = {
        id: new Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: new Types.ObjectId().toHexString(),
        expiresAt: "some day",
        ticket: {
            id: new Types.ObjectId().toHexString(),
            price: 45
        }
    };

    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    };

    return { listener, data, message };
};

it("Should replicate the order info into the local orders collection", async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    const order = await Order.findById(data.id);

    expect(order!.price).toEqual(data.ticket.price);
});

it("Should ack the message", async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
});