import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { DatabaseConnectionError } from "../errors/datatbase-connection-error";

const router = Router();

router.post("/signup", [
    body('email')
        .isEmail()
        .withMessage("An invalid email was provided"),
    body('password')
        .trim()
        .isLength({min: 4, max: 20})
        .withMessage("Password must be between 4 and 20 characters length")
], (req: Request, res: Response) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    console.log("Creating user...");
    throw new DatabaseConnectionError();
    res.send({});
});

export { router as signupRouter };