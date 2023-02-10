import { Message } from "node-nats-streaming";
import { Listener, Subject, Queue, TicketUpdatedEventData } from "@giticket.dev/common";

import { Ticket } from "../../models";

export class TicketUpdatedListener extends Listener<Subject.TicketUpdated, TicketUpdatedEventData> {
    readonly subject: Subject.TicketUpdated = Subject.TicketUpdated;
    queueGroup: Queue = Queue.Orders;

    async onMessage(data: TicketUpdatedEventData, message: Message): Promise<void> {
        const ticket = await Ticket.findByEvent(data);

        if (!ticket) {
            throw new Error("Ticket not found");
        }

        const { title, price } = data;
        ticket.set({ title, price });
        await ticket.save();

        message.ack();
    }
}