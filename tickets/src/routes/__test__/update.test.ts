import request from "supertest";
import { Types } from "mongoose";

import { app } from "../../app";
import { EventBus } from "../../event-bus";

it("Should return a 401 if the user does not own the ticket", async () => {
    const { body } = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({ title: "Some ticket", price: 100 })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${body.id}`)
        .set("Cookie", global.signin())
        .send({
            title: "Some other title",
            price: 100
        })
        .expect(401);
});

it("Should return a 404 if a ticket with given id does not exist", async () => {
    const id = new Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .set("Cookie", global.signin())
        .send({
            title: "New ticket title",
            price: 1000
        })
        .expect(404);
});

it("Should return a 401 if the user is not signed in", async () => {
    const id = new Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: "New ticket title",
            price: 1000
        })
        .expect(401);
});

it("Should return a 400 if the user provides an invalid title or price", async () => {
    const cookie = global.signin();

    const { body } = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({ title: "Some ticket", price: 100 })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${body.id}`)
        .set("Cookie", cookie)
        .send({ title: "", price: 100 })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${body.id}`)
        .set("Cookie", cookie)
        .send({ title: "Some new title", price: -100 })
        .expect(400);
});

it("Should update the ticket provided valid inputs", async () => {
    const cookie = global.signin();

    const { body } = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({ title: "Some ticket", price: 100 })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${body.id}`)
        .set("Cookie", cookie)
        .send({ title: "Some different title", price: 500 })
        .expect(200);

    const updateResponse = await request(app)
        .get(`/api/tickets/${body.id}`)
        .send()
        .expect(200);

    expect(updateResponse.body.title).toEqual("Some different title");
    expect(updateResponse.body.price).toEqual(500);
});

it("Should publish an event", async () => {
    const cookie = global.signin();

    const { body } = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({ title: "Some ticket", price: 100 })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${body.id}`)
        .set("Cookie", cookie)
        .send({ title: "Some different title", price: 500 })
        .expect(200);

    expect(EventBus.client.publish).toHaveBeenCalled();
});