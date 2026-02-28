import passport from "passport";
import { createUser } from "../db/queries.js";
import bcrypt from "bcryptjs";
import { matchedData, validationResult } from "express-validator";
async function signUpUser(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.render("signup", { errors: errors.array() });
		return;
	}

	const SALT_VALUE = 10;
	try {
		const { firstname, lastname, username, password } = matchedData(req);
		const hashedPassword = await bcrypt.hash(password, SALT_VALUE);
		await createUser(firstname, lastname, username, hashedPassword);
		res.redirect("/login");
	} catch (err) {
		next(err);
	}
}

const logInUser = passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/login",
});

async function logOutUser(req, res, next) {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		res.redirect("/");
	});
}

async function getIndex(req, res, next) {
	try {
		if (!req.user) {
			res.redirect("login");
			return;
		}
		res.render("index");
	} catch (err) {
		next(err);
	}
}

async function getSignup(req, res, next) {
	try {
		res.render("signup");
	} catch (err) {
		next(err);
	}
}

async function getLogin(req, res, next) {
	try {
		res.render("login");
	} catch (err) {
		next(err);
	}
}

export { signUpUser, logInUser, logOutUser, getIndex, getSignup, getLogin };
