import { Types } from "mongoose";
import { Message } from "node-nats-streaming";

import { TicketUpdatedEventData } from "@giticket.dev/common";
import { EventBus } from "../../../event-bus";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { Ticket } from "../../../models";

const setup = async () => {
    // Create an instance of the listener
    const listener = new TicketUpdatedListener(EventBus.client);

    // Create and save a ticket
    const ticket = new Ticket({
        title: "some ticket",
        price: 100
    });

    await ticket.save();

    // Create a fake data event
    const data: TicketUpdatedEventData = {
        id: ticket.id,
        title: "some ticket",
        price: 125,
        userId: new Types.ObjectId().toHexString(),
        version: ticket.version + 1
    };

    // Create a fake message object
    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    };

    return { listener, data, ticket, message };
};

it("Should not allow updating the ticket if an out of order event received, and ack should not be called", async () => {
    const { listener, data, ticket, message } = await setup();

    try {
        await listener.onMessage({ ...data, version: ticket.version + 2 }, message);
    } catch (error) { }

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(ticket.title);
    expect(updatedTicket!.price).toEqual(ticket.price);
    expect(message.ack).not.toHaveBeenCalled();
});

it("Should find, update and save the ticket", async () => {
    const { listener, data, ticket, message } = await setup();

    await listener.onMessage(data, message);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
});

it("Should ack the message", async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
});