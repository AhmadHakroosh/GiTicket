import { Router, Request, Response } from "express";

const router = Router();

router.post("/signout", (req: Request, res: Response) => {
    res.send("Hi there!");
});

export { router as signoutRouter };