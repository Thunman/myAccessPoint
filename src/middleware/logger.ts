import morgan from "morgan";
import fs from "fs";
import path from "path";
import { Request } from "express";

const logDir = path.join(__dirname, "../../logs");
fs.mkdirSync(logDir, { recursive: true });
const logStream = fs.createWriteStream(path.join(logDir, "logs.log"), {
	flags: "a",
});

export const logger = morgan(
	function (tokens, req, res) {
		const reqBody = { ...(req as Request).body }; // Create a copy of the request body
		if (reqBody.password) {
			reqBody.password = "REDACTED"; // Redact the password
		}
		return [
			tokens.method(req, res),
			tokens.url(req, res),
			tokens.status(req, res),
			tokens.res(req, res, "content-length"),
			"-",
			tokens["response-time"](req, res),
			"ms",
			JSON.stringify((req as Request).body),
		].join(" ");
	},
	{ stream: logStream }
);
