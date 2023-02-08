import request from "supertest";

import { app } from "../../app";
import { Ticket } from "../../models";

const createTicket = async () => {
    const ticket = new Ticket({
        title: "some ticket",
        price: 100
    });

    await ticket.save();

    return ticket;
};

it("Should has a route handler listening to /api/order for get requests", async () => {
    const response = await request(app)
        .get("/api/orders")
        .send();

    expect(response.status).not.toEqual(404);
});

it("Should be accessed only if user is signed in", async () => {
    await request(app)
        .get("/api/orders")
        .expect(401);
});


it("Should return a status other than 401 if the user is signed in", async () => {
    const response = await request(app)
        .get("/api/orders")
        .set("Cookie", global.signin())
        .send();

    expect(response.status).not.toEqual(401);
});

it("Should fetch orders of a particular user", async () => {
    // Create three tickets
    const ticketOne = await createTicket();
    const ticketTwo = await createTicket();
    const ticketThree = await createTicket();

    // Create two users #1 & #2
    const userOne = global.signin();
    const userTwo = global.signin();

    // Create one order for user #1
    await request(app)
        .post("/api/orders")
        .set("Cookie", userOne)
        .send({ ticketId: ticketOne.id })
        .expect(201);

    // Create two orders for user #2
    const { body: orderOne } = await request(app)
        .post("/api/orders")
        .set("Cookie", userTwo)
        .send({ ticketId: ticketTwo.id })
        .expect(201);

    const { body: orderTwo } = await request(app)
        .post("/api/orders")
        .set("Cookie", userTwo)
        .send({ ticketId: ticketThree.id })
        .expect(201);

    // Make request to get orders for user #2
    const { body: orders } = await request(app)
        .get("/api/orders")
        .set("Cookie", userTwo)
        .expect(200);

    // Make sure we only get orders of user #2
    expect(orders.length).toEqual(2);
    expect(orders[0].id).toEqual(orderOne.id);
    expect(orders[1].id).toEqual(orderTwo.id);
    expect(orders[0].ticket.id).toEqual(ticketTwo.id);
    expect(orders[1].ticket.id).toEqual(ticketThree.id);
});