import { Message } from "node-nats-streaming";
import { Listener, OrderCancelledEventData, Queue, Subject } from "@giticket.dev/common";
import { Ticket } from "../../models";
import { TicketUpdatedPublisher } from "../publishers";

export class OrderCancelledListener extends Listener<Subject.OrderCancelled, OrderCancelledEventData> {
    readonly subject: Subject.OrderCancelled = Subject.OrderCancelled;
    queueGroup: Queue = Queue.Tickets;

    async onMessage(data: OrderCancelledEventData, message: Message): Promise<void> {
        // Find the ticket that the order trying to reserve
        const ticket = await Ticket.findById(data.ticket.id);

        // If there is no ticket, throw error
        if (!ticket) {
            throw new Error("Ticket was not found");
        }

        // Mark the ticket as being reserved by setting its orderId property
        ticket.set({ orderId: undefined });

        // Save the ticket
        await ticket.save();

        // Emit a ticket updated event
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            orderId: ticket.orderId
        });

        // Ack the message
        message.ack();
    }
}