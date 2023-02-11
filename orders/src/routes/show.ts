import { Router, Request, Response } from "express";
import { NotAuthorizedError, NotFoundError, requireAuth } from "@giticket.dev/common";

import { stripe } from "../stripe";
import { Order } from "../models";

const router = Router();

router.get("/api/orders/:orderId", requireAuth, async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");

    if (!order) {
        throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: order.ticket.price * 100,
        currency: "usd",
        automatic_payment_methods: {
            enabled: true,
        },
    });

    res.send({
        order,
        clientSecret: paymentIntent.client_secret
    });
});

export { router as ShowOrderRouter };