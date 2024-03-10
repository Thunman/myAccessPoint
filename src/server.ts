import express from "express";
import dotenv from "dotenv";
import path from "path";
import { userRouter } from "./routes/routes";
import { logger } from "./middleware/logger";
import cors from "cors";
import cookieParser from "cookie-parser";
import https from "https";
import { readFileSync } from "fs";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const sslKey = process.env.SSL_KEY;
const sslCert = process.env.SSL_CERT;
const options = {
	key: readFileSync(sslKey),
	cert: readFileSync(sslCert),
};
const server = https.createServer(options, app);
app.use(cookieParser());
app.use(express.json());
app.use(logger);
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.static(path.resolve(__dirname, "../../myHomeFrontend/dist")));
app.use("/api/users", userRouter);
app.get("*", (req, res) => {
	res.sendFile(
		path.resolve(__dirname, "../../myHomeFrontend/dist/index.html")
	);
});
app.set("trust proxy", 1);
server.listen(port, () => {
	console.log(`server up at ${port}`);
});

server.on("error", (error: Error) => {
	console.error("Error starting server:", error);
});
