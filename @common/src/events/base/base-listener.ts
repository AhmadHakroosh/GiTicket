import { Message, Stan } from "node-nats-streaming";
import { Queue } from "../enums";

abstract class Listener<Subject extends string, EventData> {
    abstract subject: Subject;
    abstract queueGroup: Queue;

    abstract onMessage(data: EventData, message: Message): void;

    private client: Stan;

    protected ackWait: number = 5 * 1000;

    constructor(client: Stan) {
        this.client = client;
    }

    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroup);
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroup,
            this.subscriptionOptions()
        );

        subscription.on("message", (message: Message) => {
            console.log(`${this.queueGroup} | Message received from ${this.subject} | Message: ${message}`)
            const data = this.parseMessage(message);

            this.onMessage(data, message);
        });

    }

    parseMessage(message: Message) {
        const data = message.getData();
        return typeof data === "string" ? JSON.parse(data) : JSON.parse(data.toString("utf-8"));
    }
}

export { Listener };