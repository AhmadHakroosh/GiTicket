import { TicketCreatedEventData } from "@giticket.dev/common";
import { EventBus } from "../../../event-bus";
import { TicketCreatedListener } from "../ticket-created-listener";
import { Types } from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models";

const setup = async () => {
    // Create an instance of the listener
    const listener = new TicketCreatedListener(EventBus.client);

    // Create a fake data event
    const data: TicketCreatedEventData = {
        id: new Types.ObjectId().toHexString(),
        title: "some ticket",
        price: 100,
        userId: new Types.ObjectId().toHexString(),
        version: 0
    };

    // Create a fake message object
    // @ts-ignore
    const message: Message = {
        ack: jest.fn()
    };

    return { listener, data, message };
};

it("Should create and save a ticket", async () => {
    const { listener, data, message } = await setup();
    // Call the onMessage function with the data object + message object
    await listener.onMessage(data, message);

    // Write assertions to make sure a ticket was created
    const ticket = await Ticket.findById(data.id);
    
    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
});

it("Should ack the message", async () => {
    const { listener, data, message } = await setup();
    // Call the onMessage function with the data object + message object
    await listener.onMessage(data, message);

    // Write assertions to make sure ack function was called
    expect(message.ack).toHaveBeenCalled();
});