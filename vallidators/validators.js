import { body } from "express-validator";
import { findUserByUsername } from "../db/queries.js";

const locale = "en-US";

const isAlphaError = "must only contain letters";
const defaultMin = 2;
const defaultMax = 50;

const lengthError = `length must be at least ${defaultMin} characters long and less than ${defaultMax} characters`;

const validateSignUp = [
	body("firstname")
		.exists()
		.trim()
		.isAlpha(locale)
		.withMessage(`First name ${isAlphaError}`)
		.isLength({ min: defaultMin, max: defaultMax })
		.withMessage(`Firstname ${lengthError}`),

	body("lastname")
		.exists()
		.trim()
		.isAlpha(locale)
		.withMessage(`Last name ${isAlphaError}`)
		.isLength({ min: defaultMin, max: defaultMax })
		.withMessage(`Lastname ${lengthError}`),

	body("username")
		.exists()
		.trim()
		.isAlphanumeric(locale)
		.withMessage(`Username ${isAlphaError} and numbers`)
		.isLength({ min: defaultMin, max: defaultMax })
		.withMessage(`Username ${lengthError}`)
		.custom(async (value) => {
			const user = await findUserByUsername(value);
			if (user) {
				throw new Error("Username already in use");
			}
		}),

	body("password")
		.exists()
		.trim()
		.isLength({ min: 8, max: 255 })
		.withMessage("Password must be at least 8 characters long"),

	body("confirmPassword").custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error("Password confirmation doesn't match password");
		} else {
			return true;
		}
	}),
];

export { validateSignUp };
