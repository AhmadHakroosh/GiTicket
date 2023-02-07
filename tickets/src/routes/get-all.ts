import { Router, Request, Response } from "express";

import { Ticket } from "../models";

const router = Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
    const tickets = await Ticket.find({});
    res.send(tickets);
});

export { router as GetAll };