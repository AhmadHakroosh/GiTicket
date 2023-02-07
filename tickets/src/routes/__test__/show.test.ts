import request from "supertest";
import { Types } from "mongoose";

import { app } from "../../app";

it("Should return a 404 if the ticket is not found", async () => {
    const id = new Types.ObjectId().toHexString();
    await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404);
});

it("Should return the ticket if the ticket is found", async () => {
    const { title, price } = {
        title: "Fake ticket",
        price: 100
    };

    const { body } = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({ title, price })
        .expect(201);

    const response = await request(app)
        .get(`/api/tickets/${body.id}`)
        .send()
        .expect(200);

    expect(response.body.title).toEqual(title);
    expect(response.body.price).toEqual(price);
});