import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import passport from "passport";
import passportConfig from "./config/passport.js";
import router from "./routes/router.js";
import connectPgSimple from "connect-pg-simple";
import pool from "./db/pool.js";

const pgSession = connectPgSimple(session);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsPath = path.join(__dirname, "public");

const app = express();
const PORT = 3000;
app.use(express.static(assetsPath));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
	session({
		store: new pgSession({
			pool: pool,
			tableName: "user_sessions",
		}),
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
	}),
);

app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
passportConfig(passport);

//Makes the current logged in user variable available on the views
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

app.use("/", router);

app.use((req, res) => {
	res.status(404).send("404 not found");
});

app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).send("500 server error");
});

app.listen(PORT || 3000, (error) => {
	if (error) {
		throw error;
	}

	console.log(`Server running on port ${PORT}`);
});
