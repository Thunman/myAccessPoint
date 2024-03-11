import express from "express";
import { limiter } from "../middleware/rateLimiter";
import { loginValidator } from "../middleware/validation";
import { userController } from "../controllers/userController";
import { auth } from "../middleware/authentication";

export const userRouter = express.Router();

userRouter.post("/login", limiter, loginValidator, userController.login);
userRouter.get("/getLogs", auth, userController.getLogs);
userRouter.get("/getStatus", auth, userController.getStatus);
userRouter.post("/toggleMongo", auth, userController.toggleMongo);
userRouter.post("/hibernate", auth, userController.hibernatePC);
userRouter.post("/wakePC", auth, userController.wakePC);
userRouter.post("/logout", auth, userController.logout);
