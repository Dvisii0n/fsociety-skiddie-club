import { Router } from "express";
import {
	signUpUser,
	logInUser,
	logOutUser,
	getIndex,
	getSignup,
	getLogin,
} from "../controllers/controllers.js";
import { validateSignUp } from "../vallidators/validators.js";

const router = new Router();

router.get("/", getIndex);

router.get("/signup", getSignup);

router.post("/signup", validateSignUp, signUpUser);

router.get("/login", getLogin);

router.post("/login", logInUser);

router.get("/logout", logOutUser);

export default router;
