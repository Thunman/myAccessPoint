import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies.token;
	try {
		jwt.verify(token, process.env.JWT_SECRET);
		next();
	} catch (error) {
		console.error(error);
		res.status(401).json({
			success: false,
			message: "Errorcode: 1",
			data: {},
		});
	}
};
