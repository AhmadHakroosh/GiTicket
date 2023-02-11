import { Router, Request, Response } from "express";
import { BadRequestError, NotFoundError, requireAuth, validateRequest } from "@giticket.dev/common";
import { body } from "express-validator";
import { Types } from "mongoose";

import { Order, Ticket, OrderStatus } from "../models";
import { OrderCreatedPublisher } from "../events/publishers";
import { EventBus } from "../event-bus";

const EXPIRATION_WINDOW_SECONDS = 60;

const router = Router();

router.post("/api/orders", requireAuth, [
    body("ticketId").notEmpty().custom(id => Types.ObjectId.isValid(id)).withMessage("TicketId must be provided"),
], validateRequest, async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the use is trying to order in the database
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
        throw new NotFoundError();
    }

    // Make sure that this ticket is not already reserved
    // Run a query to look at all orders, and find an order where the ticket 
    // is the ticket we just found, and the order status is **NOT** cancelled
    // If we find an order like that, this means the ticket **IS** reserved
    const isTicketReserved = await ticket.isReserved();

    if (isTicketReserved) {
        throw new BadRequestError("This ticket was already reserved");
    }

    // Calculate an expiration date for this order
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Create the order and save it to the database
    const order = new Order({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt,
        ticket
    });
    await order.save();

    // Publish an event saying that an order was created
    await new OrderCreatedPublisher(EventBus.client).publish({
        id: order.id,
        version: order.version,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    });

    res.status(201).send(order);
});

export { router as CreateOrderRouter };