import { body } from "express-validator";

export const loginValidator = [
	body("userName").trim().escape(),
	body("password").trim().escape(),
];
