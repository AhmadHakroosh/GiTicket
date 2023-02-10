import request from "supertest";

import { app } from "../../app";
import { Types } from "mongoose";
import { Order, Payment } from "../../models";
import { OrderStatus } from "@giticket.dev/common";
import { stripe } from "../../stripe";

it("Should return a 404 when trying to pay for an order that does not exist", async () => {
    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin())
        .send({
            token: "12iehdso9",
            orderId: new Types.ObjectId().toHexString()
        })
        .expect(404);
});

it("Should return a 401 when trying to pay for an order that does not belong to current user", async () => {
    const order = new Order({
        userId: new Types.ObjectId().toHexString(),
        price: 100
    });

    await order.save();

    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin())
        .send({
            token: "12iehdso9",
            orderId: order.id
        })
        .expect(401);
});

it("Should return a 400 when trying to pay for a cancelled order", async () => {
    const order = new Order({
        userId: new Types.ObjectId().toHexString(),
        price: 100,
        status: OrderStatus.Cancelled
    });

    await order.save();

    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin(order.userId))
        .send({
            token: "12iehdso9",
            orderId: order.id
        })
        .expect(400);
});

it("Should return 201 with valid inputs", async () => {
    const order = new Order({
        userId: new Types.ObjectId().toHexString(),
        price: Math.floor(Math.random() * 1000000)
    });

    await order.save();

    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin(order.userId))
        .send({
            token: "tok_visa",
            orderId: order.id
        })
        .expect(201);

    const { data: charges } = await stripe.charges.list({ limit: 100 });
    const charge = charges.find(charge => charge.amount === order.price * 100);

    expect(charge).toBeDefined();
    expect(charge!.currency).toEqual("usd");
});

it("Should create a new payment record with correct data as returned by stripe", async () => {
    const order = new Order({
        userId: new Types.ObjectId().toHexString(),
        price: Math.floor(Math.random() * 1000000)
    });

    await order.save();

    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin(order.userId))
        .send({
            token: "tok_visa",
            orderId: order.id
        })
        .expect(201);

    const { data: charges } = await stripe.charges.list({ limit: 100 });
    const charge = charges.find(charge => charge.amount === order.price * 100);

    expect(charge).toBeDefined();
    expect(charge!.currency).toEqual("usd");

    const payment = await Payment.findOne({ orderId: order.id, stripeId: charge!.id });
    expect(payment).not.toBeNull();
});