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

async function getAllMessages() {
	const { rows } = await pool.query(
		"SELECT username AS author, title, body, date_created FROM messages JOIN users ON messages.user_id = users.id",
	);

	return rows;
}

async function updateMemberStatus(userId) {
	await pool.query("UPDATE users SET member_status = 'member' WHERE id = $1", [
		userId,
	]);
}

export default {
	createUser,
	findUserByUsername,
	getAllMessages,
	updateMemberStatus,
};
