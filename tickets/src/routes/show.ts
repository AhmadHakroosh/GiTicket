import { Router, Request, Response } from "express";
import { body } from "express-validator";

import { NotFoundError, requireAuth, validateRequest } from "@giticket.dev/common";
import { Ticket } from "../models";

const router = Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)
    
    if(!ticket) {
        throw new NotFoundError();
    }

    res.send(ticket);
});

export { router as ShowTicket };