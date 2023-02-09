import { ExpirationCompleteEventData, Publisher, Subject } from "@giticket.dev/common";

export class ExpirationCompletePublisher extends Publisher<Subject.ExpirationComplete, ExpirationCompleteEventData> {
    readonly subject: Subject.ExpirationComplete = Subject.ExpirationComplete;
}