import { Request, Response } from "express";
import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 5,
	handler: (req: Request, res: Response) => {
		res.status(429).json({ message: "Errorcode: 3" });
	},
});
