import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const userController = {
	login: async (req: Request, res: Response) => {
		try {
			const { username, password } = req.body.values;
			if (
				username === process.env.USERNAME &&
				password === process.env.PASSWORD
			) {
				const token = jwt.sign({ username }, process.env.JWT_SECRET, {
					expiresIn: "1h",
				});
				res.cookie("token", token, {
					httpOnly: true,
					secure: true,
					sameSite: "none",
				});
				res.status(200).json({ message: "Success" });
			} else {
				res.status(401).json({ message: "Errorcode 2" });
			}
		} catch (error) {
			console.error(error);
			res.status(400).json({ message: "Errorcode: 2" });
		}
	},
};
