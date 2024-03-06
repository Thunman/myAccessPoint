import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const userController = {
	login: async (req: Request, res: Response) => {
		try {
			const { userName, password } = req.body;
			if (
				userName === process.env.USERNAME &&
				password === process.env.PWD
			) {
				const token = jwt.sign(userName, process.env.JWT_SECRET, {
					expiresIn: "1h",
				});
				res.cookie("token", token, {
					httpOnly: true,
					secure: true,
					sameSite: "none",
				});
			}
		} catch (error) {
			console.error(error);
			res.status(400).json({ message: "Errorcode: 2" });
		}
	},
};
