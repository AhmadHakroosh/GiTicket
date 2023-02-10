import { PaymentCreatedEventData, Publisher, Subject } from "@giticket.dev/common";

export class PaymentCreatedPublisher extends Publisher<Subject.PaymentCreated, PaymentCreatedEventData> {
    readonly subject: Subject.PaymentCreated = Subject.PaymentCreated;
}