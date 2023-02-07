import request from "supertest";

import { app } from "../../app";

const createTicket = () => {
    return request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title: "Ticket 1",
            price: 120
        });
}

it("Should return the whole list of tickets", async () => {
    await createTicket();
    await createTicket();
    await createTicket();
    await createTicket();

    const { body } = await request(app)
        .get("/api/tickets")
        .send()
        .expect(200);

    expect(body.length).toEqual(4);
});