import nats from "node-nats-streaming";

import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const stan = nats.connect("tickets", "abc", {
    url: "http://localhost:4222"
});

stan.on("connect", async () => {
    console.log("Publisher connected to NATS");

    // const data = JSON.stringify({
    //     id: "123",
    //     title: "Ceremony",
    //     price: "120"
    // });

    // stan.publish("ticket:created", data, () => {
    //     console.log("Event published");
    // });

    const publisher = new TicketCreatedPublisher(stan);

    try {
        await publisher.publish({
            id: "111",
            title: "Ceremony",
            price: 100
        });
    } catch (error) {
        console.error(error);
    }

});