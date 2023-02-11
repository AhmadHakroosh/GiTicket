import { OrderCancelledEventData, OrderCreatedEventData, OrderStatus } from "@giticket.dev/common";
import { EventBus } from "../../../event-bus";
import { Ticket } from "../../../models";
import { Types } from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCancelledListener(EventBus.client);

    // Create and save a ticket
    const ticket = new Ticket({
        title: "some ticket",
        price: 100,
        userId: "abcd"
    });

    await ticket.save();

    // Create a fake data event
    const data: OrderCancelledEventData = {
        id: new Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id: ticket.id,
        }
    };

    // Create a fake message object
    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    };

    return { listener, data, ticket, message };
};

it("Should throw an error if no ticket was found", async () => {
    const { listener, data, message } = await setup();

    data.ticket.id = new Types.ObjectId().toHexString();

    try {
        await listener.onMessage(data, message);
    } catch (error: any) {
        expect(error.message).toEqual("Ticket was not found");
    }

    expect(message.ack).not.toHaveBeenCalled();
});

it("Should set the orderId property to undefined", async () => {
    const { listener, data, ticket, message } = await setup();

    await listener.onMessage(data, message);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.orderId).toBeUndefined();
});

it("Should ack the message", async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
});

it("Should publish a ticket updated event", async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(EventBus.client.publish).toHaveBeenCalled();
});