import { Router, Request, Response } from "express";
import { body } from "express-validator";

import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from "@giticket.dev/common";
import { Ticket } from "../models";
import { TicketUpdatedPublisher } from "../events";
import { EventBus } from "../event-bus";

const router = Router();

router.put("/api/tickets/:id", requireAuth, [
    body("title").notEmpty().withMessage("Title is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0")
], validateRequest, async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        throw new NotFoundError();
    }

    if(ticket.orderId) {
        throw new BadRequestError("Cannot edit a reserved ticket");
    }

    if (ticket.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    ticket.set({ title, price });

    await ticket.save();
    await new TicketUpdatedPublisher(EventBus.client).publish({
        id: ticket.id,
        version: ticket.version,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
    });

    res.send(ticket);
});

export { router as UpdateTicket };