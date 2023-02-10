import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from "@giticket.dev/common";
import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { Order, Payment } from "../models";
import { stripe } from "../stripe";
import { PaymentCreatedPublisher } from "../events/publishers";
import { EventBus } from "../event-bus";

const router = Router();

router.post("/api/payments", requireAuth, [
    body("token").notEmpty(),
    body("orderId").notEmpty()
], validateRequest, async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

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

    const charge = await stripe.charges.create({
        currency: "usd",
        amount: order.price * 100,
        source: token
    });

    const payment = new Payment({
        orderId,
        stripeId: charge!.id
    });

    await payment.save();

    await new PaymentCreatedPublisher(EventBus.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId
    });

    res.status(201).send({ id: payment.id });
});

export { router as CreatePaymentRouter };