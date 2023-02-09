import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEventData, Queue, Subject } from "@giticket.dev/common";
import { Ticket } from "../../models";
import { TicketUpdatedPublisher } from "../publishers";

export class OrderCreatedListener extends Listener<Subject.OrderCreated, OrderCreatedEventData> {
    readonly subject: Subject.OrderCreated = Subject.OrderCreated;
    queueGroup: Queue = Queue.Tickets;

    async onMessage(data: OrderCreatedEventData, message: Message): Promise<void> {
        // Find the ticket that the order trying to reserve
        const ticket = await Ticket.findById(data.ticket.id);

        // If there is no ticket, throw error
        if (!ticket) {
            throw new Error("Ticket was not found");
        }

        // Mark the ticket as being reserved by setting its orderId property
        ticket.set({ orderId: data.id });

        // Save the ticket
        await ticket.save();

        // Emit event ticket:updated
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            orderId: data.id
        });

        // Ack the message
        message.ack();
    }
}