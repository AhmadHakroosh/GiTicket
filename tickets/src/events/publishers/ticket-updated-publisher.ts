import { Publisher, TicketEventData } from "@giticket.dev/common";
import { Subject } from "@giticket.dev/common";

export class TicketUpdatedPublisher extends Publisher<Subject.TicketUpdated, TicketEventData> {
    readonly subject: Subject.TicketUpdated = Subject.TicketUpdated;
}