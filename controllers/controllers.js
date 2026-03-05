import passport from "passport";
import queries from "../db/queries.js";
import bcrypt from "bcryptjs";
import { matchedData, validationResult } from "express-validator";

async function signUpUser(req, res, next) {
	const SALT_VALUE = 10;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.render("signup", { errors: errors.array() });
		return;
	}

	try {
		const { firstname, lastname, username, password } = matchedData(req);
		const hashedPassword = await bcrypt.hash(password, SALT_VALUE);
		await queries.createUser(firstname, lastname, username, hashedPassword);
		res.redirect("/login");
	} catch (err) {
		next(err);
	}
}
const logInUser = passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/login",
	failureMessage: true,
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
		if (!req.isAuthenticated()) {
			res.redirect("login");
			return;
		}

		const userMessages = await queries.getAllMessages();
		res.render("index", { userMessages: userMessages });
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
		const sessionMessages = req.session.messages;
		if (sessionMessages) {
			const messageSet = new Set();
			sessionMessages.forEach((msg) => {
				messageSet.add(msg);
			});
			req.session.messages = [];
			res.render("login", { failureMessages: Array.from(messageSet) });
			return;
		}

		res.render("login");
	} catch (err) {
		next(err);
	}
}
async function joinClub(req, res, next) {
	try {
		if (!req.isAuthenticated) {
			res.send(401);
			return;
		}

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.redirect("/");
			return;
		}

		await queries.updateMemberStatus(req.user.id);
		res.redirect("/");
	} catch (err) {
		next(err);
	}
}

async function postMessage(req, res, next) {
	try {
		if (!req.isAuthenticated) {
			res.send(401);
			return;
		}

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.render("partials/errors", { errors: errors.array() });
			return;
		}

		const { title, body } = matchedData(req);
		await queries.createMessage(req.user.id, title, body);

		res.redirect("/");
	} catch (err) {
		next(err);
	}
}

async function deleteMessage(req, res, next) {
	try {
		if (!req.isAuthenticated) {
			res.send(401);
			return;
		}

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.redirect("/");
			return;
		}

		const { id } = matchedData(req);
		await queries.deleteMessage(id);

		res.send(200);
	} catch (err) {
		next(err);
	}
}

export {
	signUpUser,
	logInUser,
	logOutUser,
	getIndex,
	getSignup,
	getLogin,
	joinClub,
	postMessage,
	deleteMessage,
};
