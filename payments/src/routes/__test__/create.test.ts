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
            paymentId: "12iehdso9",
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
            paymentId: "12iehdso9",
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
            paymentId: "12iehdso9",
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

    const { id: paymentId } = await stripe.paymentIntents.create({
        amount: order.price * 100,
        currency: "usd",
        confirm: true,
        payment_method: "pm_card_visa",
        description: `giticket.dev test automation`
    });

    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin(order.userId))
        .send({
            paymentId,
            orderId: order.id
        })
        .expect(201);

    const { status, amount_received } = await stripe.paymentIntents.retrieve(paymentId);

    expect(status).toEqual("succeeded");
    expect(amount_received).toEqual(order.price * 100);
});

it("Should throw an error of payment failure", async () => {
    const order = new Order({
        userId: new Types.ObjectId().toHexString(),
        price: Math.floor(Math.random() * 1000000)
    });

    await order.save();

    const { id: paymentId } = await stripe.paymentIntents.create({
        amount: order.price * 100,
        currency: "usd",
        payment_method: "pm_card_visa",
        description: `giticket.dev test automation`
    });

    try {
        await request(app)
            .post("/api/payments")
            .set("Cookie", global.signin(order.userId))
            .send({
                paymentId,
                orderId: order.id
            });
    } catch (error: any) {
        expect(error.message).toEqual("Payment was not successfull");
    }

    const { status, amount_received } = await stripe.paymentIntents.retrieve(paymentId);

    expect(status).toEqual("requires_confirmation");
    expect(amount_received).toEqual(0);
});

it("Should create a new payment record with correct data as returned by stripe", async () => {
    const order = new Order({
        userId: new Types.ObjectId().toHexString(),
        price: Math.floor(Math.random() * 1000000)
    });

    await order.save();

    const { id: paymentId } = await stripe.paymentIntents.create({
        amount: order.price * 100,
        currency: "usd",
        confirm: true,
        payment_method: "pm_card_visa",
        description: `giticket.dev test automation`
    });

    await request(app)
        .post("/api/payments")
        .set("Cookie", global.signin(order.userId))
        .send({
            paymentId,
            orderId: order.id
        })
        .expect(201);

    const { status, amount_received } = await stripe.paymentIntents.retrieve(paymentId);

    expect(status).toEqual("succeeded");
    expect(amount_received).toEqual(order.price * 100);

    const payment = await Payment.findOne({ orderId: order.id, stripeId: paymentId });
    expect(payment).not.toBeNull();
});