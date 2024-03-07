import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { exec } from "child_process";

export const userController = {
	login: async (req: Request, res: Response) => {
		try {
			const { username, password } = req.body;
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

	getLogs: async (req: Request, res: Response) => {
		try {
			const filePath = path.resolve(__dirname, "../../logs/logs.log");
			if (fs.existsSync(filePath)) {
				const logFile = fs.readFileSync(filePath, "utf8");
				res.json({ logFile });
			} else {
				res.status(404).json({ message: "Log file not found." });
			}
		} catch (error) {
			console.error(error);
			res.status(500).json({
				message: "An error occurred while fetching the logs.",
			});
		}
	},
	getStatus: async (req: Request, res: Response) => {
		try {
			exec(
				"docker inspect -f '{{.State.Running}}' mongodb",
				(error, stdout) => {
					if (error) {
						res.status(500).json({ message: "Error getting status" });
					} else {
						const isMongoRunning = stdout.trim() === "true";
						const isMainPCRunning = true;
						res.json({ mongo: isMongoRunning, pc: isMainPCRunning });
					}
				}
			);
		} catch (error) {
			res.status(500).json({ message: "Error getting status" });
		}
	},
};
