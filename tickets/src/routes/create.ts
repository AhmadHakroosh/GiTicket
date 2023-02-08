import { Router, Request, Response } from "express";
import { body } from "express-validator";

import { requireAuth, validateRequest } from "@giticket.dev/common";
import { Ticket } from "../models";
import { TicketCreatedPublisher } from "../events";
import { EventBus } from "../event-bus";

const router = Router();

router.post("/api/tickets", requireAuth, [
    body("title").notEmpty().withMessage("Title is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0")
], validateRequest, async (req: Request, res: Response) => {
    const { title, price } = req.body;
    
    const ticket = new Ticket({
        title,
        price,
        userId: req.currentUser!.id
    });
    
    await ticket.save();
    
    await new TicketCreatedPublisher(EventBus.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
    });

    res.status(201).send(ticket);
});

export { router as CreateTicket };