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
  (tokens, req, res) => {
    if (tokens.url(req, res) === "/api/users/login") {
      const reqBody = { ...(req as Request).body };
      if (reqBody.password) {
        reqBody.password = "REDACTED";
      }

      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"),
        "-",
        tokens["response-time"](req, res),
        "ms",
        JSON.stringify(reqBody),
      ].join(" ");
    }
  },
  { stream: logStream }
);
