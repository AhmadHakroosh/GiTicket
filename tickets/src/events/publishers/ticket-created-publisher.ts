import { Publisher, TicketEventData } from "@giticket.dev/common";
import { Subject } from "@giticket.dev/common";

export class TicketCreatedPublisher extends Publisher<Subject.TicketCreated, TicketEventData> {
    readonly subject: Subject.TicketCreated = Subject.TicketCreated;
}