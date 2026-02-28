import { Router } from "express";
import {
	signUpUser,
	logInUser,
	logOutUser,
	getIndex,
	getSignup,
	getLogin,
	joinClub,
} from "../controllers/controllers.js";
import { validatePasscode, validateSignUp } from "../validators/validators.js";

const router = new Router();

router.get("/", getIndex);

router.get("/signup", getSignup);

router.post("/signup", validateSignUp, signUpUser);

router.get("/login", getLogin);

router.post("/login", logInUser);

router.get("/logout", logOutUser);

router.post("/join", validatePasscode, joinClub);

//TODO - validate and post messages

export default router;
