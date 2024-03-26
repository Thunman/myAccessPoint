import express from "express";
import { limiter } from "../middleware/rateLimiter";
import { loginValidator } from "../middleware/validation";
import { userController } from "../controllers/userController";
import { auth } from "../middleware/authentication";

export const userRouter = express.Router();

userRouter.post("/login", limiter, loginValidator, userController.login);
userRouter.get("/getLogs", auth, userController.getLogs);
userRouter.get("/getStatus", auth, userController.getStatus);
userRouter.post("/startMongo", auth, userController.startMongo);
userRouter.post("/stopMongo", auth, userController.stopMongo);
userRouter.post("/hibernate", auth, userController.hibernatePC);
userRouter.post("/wakePC", auth, userController.wakePC);
userRouter.post("/logout", userController.logout);
userRouter.get("/getDiskStatus", auth, userController.getDiskStatus);
