import request from "supertest";

import { app } from "../../app";
import { Ticket } from "../../models";

it("Should has a route handler listening to /api/tickets for post requests", async () => {
    const response = await request(app)
        .post("/api/tickets")
        .send({});

    expect(response.status).not.toEqual(404);
});

it("Should be accessed only if user is signed in", async () => {
    await request(app)
        .post("/api/tickets")
        .send({})
        .expect(401);
});


it("Should return a status other than 401 if the user is signed in", async () => {

    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({});

    expect(response.status).not.toEqual(401);
});

it("Should return an error if an invalid title is provided", async () => {
    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title: "",
            price: 10
        })
        .expect(400);

    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            price: 10
        })
        .expect(400);
});

it("Should return an error if an invalid price is provided", async () => {
    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title: "Some ticket",
            price: -10
        })
        .expect(400);

    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title: "Some ticket"
        })
        .expect(400);
});

it("Should create a ticket with valid parameters", async () => {
    let tickets = await Ticket.find({});

    const { title, price } = {
        title: "Some ticket",
        price: 120
    };

    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({ title, price })
        .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(price);
    expect(tickets[0].title).toEqual(title);
});