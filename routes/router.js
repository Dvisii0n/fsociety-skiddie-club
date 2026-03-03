import { Router } from "express";
import {
	signUpUser,
	logInUser,
	logOutUser,
	getIndex,
	getSignup,
	getLogin,
	joinClub,
	postMessage,
	deleteMessage,
} from "../controllers/controllers.js";

import {
	validateId,
	validateMessage,
	validatePasscode,
	validateSignUp,
} from "../validators/validators.js";

const router = new Router();

router.get("/", getIndex);

router.get("/signup", getSignup);

router.post("/signup", validateSignUp, signUpUser);

router.get("/login", getLogin);

router.post("/login", logInUser);

router.get("/logout", logOutUser);

router.post("/join", validatePasscode, joinClub);

router.post("/postMessage", validateMessage, postMessage);

router.delete("/deleteMessage/:id", validateId, deleteMessage);

export default router;
