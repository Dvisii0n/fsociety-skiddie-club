import { body, param } from "express-validator";
import queries from "../db/queries.js";

const SUPER_SECRET_PASSCODE = "mrrobot";

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
			const user = await queries.findUserByUsername(value);
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

const validatePasscode = [
	body("passcode")
		.exists()
		.trim()
		.isAlphanumeric(locale)
		.isLength({ max: 25 })
		.custom((value) => {
			if (value !== SUPER_SECRET_PASSCODE) {
				throw new Error("That's not the passcode");
			} else {
				return true;
			}
		}),
];

const validationRegex = /^[A-Za-z0-9 .,'!&?\r\n]+$/;

const validateMessage = [
	body("title")
		.exists()
		.isLength({ min: defaultMin, max: defaultMax })
		.withMessage("Title too long or too short")
		.matches(validationRegex)
		.withMessage("Title can only contain numbers or letters and punctuation"),
	body("body")
		.exists()
		.isLength({ min: defaultMin, max: 300 })
		.withMessage("Message body is too long or too short")
		.matches(validationRegex)
		.withMessage(
			"Message body can only contain numbers or letters and punctuation",
		),
];

const validateId = [param("id").exists().trim().isInt({ min: 1 })];

export { validateSignUp, validatePasscode, validateMessage, validateId };
