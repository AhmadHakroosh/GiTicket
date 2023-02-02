import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { User } from "../models/user";
import { BadRequestError } from "../errors/bad-request-error";

const router = Router();

router.post("/signup", [
    body('email')
        .isEmail()
        .withMessage("An invalid email was provided"),
    body('password')
        .trim()
        .isLength({min: 4, max: 20})
        .withMessage("Password must be between 4 and 20 characters length")
], async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;
    const exists = await User.findOne({ email });

    if(exists) {
        throw new BadRequestError("Email is already in use");
    }

    const user = new User({
        email,
        password
    });

    await user.save();

    res.status(201).send(user);
});

export { router as signupRouter };