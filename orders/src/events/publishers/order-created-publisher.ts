import { Publisher, OrderCreatedEventData, Subject } from "@giticket.dev/common";

export class OrderCreatedPublisher extends Publisher<Subject.OrderCreated, OrderCreatedEventData> {
    readonly subject: Subject.OrderCreated = Subject.OrderCreated;
}