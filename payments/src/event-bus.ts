import nats, { Stan } from "node-nats-streaming";

class NATS {
    #client?: Stan;

    get client() {
        if (!this.#client) {
            throw new Error("Cannot access NATS client before connecting");
        }

        return this.#client;
    }

    async connect(clusterId: string, clientId: string, url: string): Promise<void> {
        this.#client = nats.connect(clusterId, clientId, { url });

        return new Promise((resolve, reject) => {
            this.client.on("connect", () => {
                console.log("Connected to Event-Bus");
                resolve();
            });

            this.client.on("error", (error) => {
                reject(error);
            });
        });
    }
}

export const EventBus = new NATS();