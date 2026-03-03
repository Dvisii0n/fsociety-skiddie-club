export function convertErrorsToStrings(errors) {
	const arr = errors.array();
	const messages = arr.map((error) => `${error.msg}\n`);
	return messages.join("");
}
