import request from "supertest";
import { Types } from "mongoose";

import { app } from "../../app";
import { EventBus } from "../../event-bus";
import { Ticket } from "../../models";

it("Should has a route handler listening to /api/order for post requests", async () => {
    const response = await request(app)
        .post("/api/orders")
        .send({});

    expect(response.status).not.toEqual(404);
});

it("Should be accessed only if user is signed in", async () => {
    await request(app)
        .post("/api/orders")
        .send({})
        .expect(401);
});


it("Should return a status other than 401 if the user is signed in", async () => {
    const response = await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin())
        .send({});

    expect(response.status).not.toEqual(401);
});

it("Should return an error if the ticket does not exist", async () => {
    const ticketId = new Types.ObjectId().toHexString();

    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin())
        .send({ ticketId })
        .expect(404);
});

it("Should return an error if the ticket is already reserved", async () => {
    const ticket = new Ticket({
        title: "some ticket",
        price: 100
    });

    await ticket.save();

    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin())
        .send({ ticketId: ticket.id })
        .expect(201);

    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin())
        .send({ ticketId: ticket.id })
        .expect(400);
});

it("Should reserve the ticket", async () => {
    const ticket = new Ticket({
        title: "some ticket",
        price: 100
    });

    await ticket.save();

    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin())
        .send({ ticketId: ticket.id })
        .expect(201);
});

it("Should publish an event", async () => {
    const ticket = new Ticket({
        title: "some ticket",
        price: 100
    });

    await ticket.save();

    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin())
        .send({ ticketId: ticket.id })
        .expect(201);

    expect(EventBus.client.publish).toHaveBeenCalled();
});