import pool from "./pool.js";

async function createUser(firstName, lastName, username, hashedPassword) {
	await pool.query(
		"INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)",
		[firstName, lastName, username, hashedPassword],
	);
}

async function findUserByUsername(username) {
	const { rows } = await pool.query(
		"SELECT username FROM users WHERE username = $1",
		[username],
	);
	return rows[0];
}

export { createUser, findUserByUsername };
