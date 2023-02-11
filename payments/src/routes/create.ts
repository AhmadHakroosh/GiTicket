import Stripe from "stripe";
import { body } from "express-validator";
import { Router, Request, Response } from "express";
import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@giticket.dev/common";

import { Order, Payment } from "../models";
import { stripe } from "../stripe";
import { PaymentCreatedPublisher } from "../events/publishers";
import { EventBus } from "../event-bus";

const router = Router();

router.post("/api/payments", requireAuth, [
    body("paymentId").notEmpty(),
    body("orderId").notEmpty()
], validateRequest, async (req: Request, res: Response) => {
    const { paymentId, orderId } = req.body;

    console.log(paymentId);

    const order = await Order.findById(orderId);

    if (!order) {
        throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
        throw new BadRequestError("The specified order was cancelled");
    }

    const stripePayment: Stripe.PaymentIntent = await stripe.paymentIntents.retrieve(paymentId);

    if(stripePayment.status !== "succeeded") {
        throw new Error("Payment was not successfull");
    }

    const payment = new Payment({
        orderId,
        stripeId: stripePayment.id
    });

    await payment.save();

    await new PaymentCreatedPublisher(EventBus.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId
    });

    res.status(201).send({ payment: stripePayment });
});

export { router as CreatePaymentRouter };