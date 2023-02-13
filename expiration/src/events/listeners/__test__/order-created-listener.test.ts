import { OrderCreatedEventData, OrderStatus } from "@giticket.dev/common";
import { EventBus } from "../../../event-bus";
import { OrderCreatedListener } from "../order-created-listener";
import { Types } from "mongoose";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../../queues";

jest.mock("../../../queues/expiration-queue");

const setup = async () => {
    const listener = new OrderCreatedListener(EventBus.client);

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + 1);

    const data: OrderCreatedEventData = {
        id: new Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: new Types.ObjectId().toHexString(),
        expiresAt: expiresAt.toISOString(),
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

it("Should add a job to the queue", async () => {
    
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(expirationQueue.add).toHaveBeenCalled();
});

it("Should ack the message", async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
});