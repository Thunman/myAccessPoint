import express from "express";
import dotenv from "dotenv";
import path from "path";
import { userRouter } from "./routes/routes";
import { logger } from "./middleware/logger";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());
app.use(logger);
app.use(cors());
app.use(
	express.static(path.resolve("/home/thunman/home-server/myHomeFrontend/dist"))
);
app.use("/api/users", userRouter);
app.get("*", (req, res) => {
	res.sendFile(
		path.resolve("/home/thunman/home-server/myHomeFrontend/dist/index.html")
	);
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
