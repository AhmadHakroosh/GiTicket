import { Message } from "node-nats-streaming";

import { Listener } from "../../../@common/src/events/base/base-listener";
import { TicketEventData } from "../../../@common/src/events/interfaces/ticket-event-data";
import { TicketCreated, TicketUpdated } from "../../../@common/src/events/types/subject";

class TicketCreatedListener extends Listener<TicketUpdated, TicketEventData> {
    readonly subject: TicketUpdated = "ticket:updated";
    queueGroup = "payments-service";

    onMessage(data: TicketEventData, message: Message): void {
        console.log(`Event data!`, data);
        message.ack();
    }
}

export { TicketCreatedListener };