import { Router, Request, Response } from "express";
import { NotAuthorizedError, NotFoundError, requireAuth } from "@giticket.dev/common";
import { Order, OrderStatus } from "../models";
import { OrderCancelledPublisher } from "../events/publishers";
import { EventBus } from "../event-bus";

const router = Router();

router.patch("/api/orders/:orderId", requireAuth, async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("ticket");

    if(!order) {
        throw new NotFoundError();
    }

    if(order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    await new OrderCancelledPublisher(EventBus.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id
        }
    });

    res.status(200).send(order);
});

export { router as CancelOrderRouter };