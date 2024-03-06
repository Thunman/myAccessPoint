import express from "express";
import dotenv from "dotenv";
import path from "path";
import { userRouter } from "./routes/routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.resolve("/home/thunman/myHomeFrontend/dist")));
app.use(express.json());
app.use("/api/users", userRouter);
app.get("*", (req, res) => {
	res.sendFile(path.resolve("/home/thunman/myHomeFrontend/dist/index.html"));
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
