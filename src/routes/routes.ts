import express from "express";
import { limiter } from "../middleware/rateLimiter";
import { loginValidator } from "../middleware/validation";
import { userController } from "../controllers/userController";

export const userRouter = express.Router();

userRouter.post("/login", limiter, loginValidator, userController.login);
