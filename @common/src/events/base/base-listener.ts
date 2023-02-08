import { Message, Stan } from "node-nats-streaming";

abstract class Listener<Subject extends string, EventData> {
    abstract subject: Subject;
    abstract queueGroup: string;

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
            console.log(`Message received: ${this.subject} : ${this.queueGroup}`)
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