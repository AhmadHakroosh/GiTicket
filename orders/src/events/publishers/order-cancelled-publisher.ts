import { Publisher, OrderCancelledEventData, Subject } from "@giticket.dev/common";

export class OrderCancelledPublisher extends Publisher<Subject.OrderCancelled, OrderCancelledEventData> {
    readonly subject: Subject.OrderCancelled = Subject.OrderCancelled;
}