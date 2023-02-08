import { Publisher } from "../../../@common/src/events/base/base-publisher";
import { TicketEventData } from "../../../@common/src/events/interfaces/ticket-event-data";
import { TicketCreated } from "../../../@common/src/events/types/subject";

export class TicketCreatedPublisher extends Publisher<TicketCreated, TicketEventData> {
    readonly subject: TicketCreated = "ticket:created";
}