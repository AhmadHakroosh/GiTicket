import { Stan } from "node-nats-streaming";

export abstract class Publisher<Subject extends string, EventData> {
    abstract subject: Subject;

    private client: Stan;

    constructor(client: Stan) {
        this.client = client;
    }

    publish(data: EventData): Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.publish(this.subject, JSON.stringify(data), (error: any) => {
                if(error) {
                    return reject(error);
                }
                console.log(`Event published to ${this.subject} | Message: ${JSON.stringify(data)}`);
                resolve();
            });
        });
    }
}