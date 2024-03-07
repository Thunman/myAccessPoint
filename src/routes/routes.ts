import express from "express";
import { limiter } from "../middleware/rateLimiter";
import { loginValidator } from "../middleware/validation";
import { userController } from "../controllers/userController";
import { auth } from "../middleware/authentication";

export const userRouter = express.Router();

userRouter.post("/login", limiter, loginValidator, userController.login);
userRouter.get("/getLogs", limiter, auth, userController.getLogs);
userRouter.get("/getStatus", limiter, auth, userController.getStatus);
