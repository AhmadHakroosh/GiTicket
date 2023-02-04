import { Router, Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { validateRequest, BadRequestError } from "@giticket.dev/common";
import { User } from "../models";

const router = Router();

router.post("/signup", 
    [
        body('email')
            .isEmail()
            .withMessage("An invalid email was provided"),
        body('password')
            .trim()
            .isLength({min: 4, max: 20})
            .withMessage("Password must be between 4 and 20 characters length")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
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

        const userJwt = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_KEY!);

        req.session = {
            jwt: userJwt
        };

        res.status(201).send(user);
    }
);

export { router as signupRouter };