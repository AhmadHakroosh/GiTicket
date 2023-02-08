import request from "supertest";
import { Types } from "mongoose";

import { app } from "../../app";
import { OrderStatus, Ticket } from "../../models";
import { EventBus } from "../../event-bus";

it("Should has a route handler listening to /api/orders/:id for patch requests", async () => {
    const orderId = new Types.ObjectId().toHexString();

    const response = await request(app)
        .patch(`/api/orders/${orderId}`)
        .send();

    expect(response.status).not.toEqual(404);
});

it("Should be accessed only if user is signed in", async () => {
    const orderId = new Types.ObjectId().toHexString();

    await request(app)
        .patch(`/api/orders/${orderId}`)
        .expect(401);
});


it("Should return a status other than 401 if the user is signed in", async () => {
    const orderId = new Types.ObjectId().toHexString();

    const response = await request(app)
        .patch(`/api/orders/${orderId}`)
        .set("Cookie", global.signin())
        .send();

    expect(response.status).not.toEqual(401);
});


it("Should return 404 if the order does not exist", async () => {
    const orderId = new Types.ObjectId().toHexString();

    await request(app)
        .patch(`/api/orders/${orderId}`)
        .set("Cookie", global.signin())
        .send()
        .expect(404);
});

it("Should return 401 if the order is for a different user", async () => {
    const ticket = new Ticket({
        title: "some ticket",
        price: 100
    });

    await ticket.save();

    const { body: order } = await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin())
        .send({ ticketId: ticket.id })
        .expect(201);

    await request(app)
        .patch(`/api/orders/${order.id}`)
        .set("Cookie", global.signin())
        .send()
        .expect(401);
});

it("Should cancel the order", async () => {
    // Create a ticket
    const ticket = new Ticket({
        title: "some ticket",
        price: 100
    });

    await ticket.save();

    const user = global.signin();
    // Make a request to build an order with this ticket
    const { body: order } = await request(app)
        .post("/api/orders")
        .set("Cookie", user)
        .send({ ticketId: ticket.id })
        .expect(201);

    // Make a request to fetch the order
    const { body: cancelled } = await request(app)
        .patch(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .send()
        .expect(200);

    // Make a request to fetch the order
    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .send()
        .expect(200);

    expect(cancelled.id).toEqual(order.id);
    expect(cancelled.status).toEqual(OrderStatus.Cancelled);
    expect(fetchedOrder.status).toEqual(OrderStatus.Cancelled);
});

it("Should publish an event", async () => {
    const ticket = new Ticket({
        title: "some ticket",
        price: 100
    });

    await ticket.save();

    const user = global.signin();

    const { body: order } = await request(app)
        .post("/api/orders")
        .set("Cookie", user)
        .send({ ticketId: ticket.id })
        .expect(201);

    await request(app)
        .patch(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .send()
        .expect(200);

    expect(EventBus.client.publish).toHaveBeenCalled();
});