import { Router, Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { User } from "../models/user";
import { validateRequest } from "../middlewares/validate-request";
import { BadRequestError } from "../errors/bad-request-error";
import { PasswordService } from "../services/password-service";

const router = Router();

router.post("/signin",
    [
        body("email").isEmail().withMessage("The email provided is invalid"),
        body("password").trim().notEmpty().withMessage("You must provide a password")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if(!user) {
            throw new BadRequestError("Invalid username or password");
        }

        const passwordMatches = await PasswordService.compare(user.password, password);

        if(!passwordMatches) {
            throw new BadRequestError("Invalid username or password");
        }

        // Generate a JWT
        const userJwt = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_KEY!);

        // Store it session object
        req.session = {
            jwt: userJwt
        };

        res.status(200).send(user);
    }
);

export { router as signinRouter };