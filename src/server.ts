import express from "express";
import dotenv from "dotenv";
import { readFileSync } from "fs";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
	res.send("Have a 🍺 or 🍻!");
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
