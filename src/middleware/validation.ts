import { body } from "express-validator";

export const loginValidator = [
	body("username").trim().escape(),
	body("password").trim().escape(),
];
