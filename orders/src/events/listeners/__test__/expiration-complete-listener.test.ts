import { ExpirationCompleteEventData } from "@giticket.dev/common";
import { EventBus } from "../../../event-bus";
import { Order, OrderStatus, Ticket } from "../../../models";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Message } from "node-nats-streaming";

const setup = async () => {
    const listener = new ExpirationCompleteListener(EventBus.client);

    const ticket = new Ticket({
        title: "some ticket",
        price: 20
    });

    await ticket.save();

    const order = new Order({
        userId: "123",
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket,
        clientSecret: "face_client_secret"
    });

    await order.save();

    const data: ExpirationCompleteEventData = {
        orderId: order.id
    };

    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    }

    return { listener, order, data, message };
};

it("Should throw an error if the order was not found", async () => {
    const { listener, message } = await setup();

    try {
        await listener.onMessage({ orderId: "some_fake_id" }, message);
    } catch (error) {
        return;
    }

    expect(message.ack).not.toHaveBeenCalled();
});

it("Should throw an error if the order was not found", async () => {
    const { listener, order, data, message } = await setup();

    order.set({ status: OrderStatus.Complete });
    await order.save();

    await listener.onMessage(data, message);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Complete);
    expect(message.ack).toHaveBeenCalled();
});

it("Should update the order status to cancelled", async () => {
    const { listener, order, data, message } = await setup();

    await listener.onMessage(data, message);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("Should emit an OrderCancelled event", async () => {
    const { listener, order, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(EventBus.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse((EventBus.client.publish as jest.Mock).mock.calls[0][1]);

    expect(eventData.id).toEqual(order.id)
});

it("Should ack the message", async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
});