import { Message } from "node-nats-streaming";
import { Listener, Subject, TicketCreatedEventData, Queue } from "@giticket.dev/common";

import { Ticket } from "../../models";

export class TicketCreatedListener extends Listener<Subject.TicketCreated, TicketCreatedEventData> {
    readonly subject: Subject.TicketCreated = Subject.TicketCreated;
    queueGroup: Queue = Queue.Orders;

    async onMessage(data: TicketCreatedEventData, message: Message): Promise<void> {
        const { id: _id, title, price } = data;

        const ticket = new Ticket({ _id, title, price });
        await ticket.save();

        message.ack();
    }
}