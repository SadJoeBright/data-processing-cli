import path from "node:path";
import { createReadStream } from "node:fs";
import { MESSAGES } from "../constants/index.js";

const INPUT_ARGUMENT = "--input";

export const count = (pathArg) => {
	const pathPart = pathArg.trimStart().slice(`${INPUT_ARGUMENT} `.length).trim();

	if (!pathPart) {
		console.log(MESSAGES.INVALID_INPUT);
		return Promise.resolve();
	}

	const filePath = path.resolve(process.cwd(), pathPart);

	return new Promise((resolve, reject) => {
		const stream = createReadStream(filePath, { encoding: "utf8" });

		let lines = 0;
		let characters = 0;
		let wordRemainder = "";
		let words = 0;
		let lastCharWasNewline = false;

		stream.on("data", (chunk) => {
			for (let i = 0; i < chunk.length; i += 1) {
				if (chunk[i] === "\n") {
					lines += 1;
					lastCharWasNewline = true;
				} else {
					characters += 1;
					lastCharWasNewline = false;
				}
			}

			wordRemainder += chunk;
			const parts = wordRemainder.split(/\s+/);
			wordRemainder = parts.pop() ?? "";
			words += parts.filter(Boolean).length;
		});

		stream.on("end", () => {
			if (characters > 0 && !lastCharWasNewline) {
				lines += 1;
			};
				
			if (wordRemainder.trim()) {
				words += 1;
			};
				
			console.log(`Lines: ${lines}`);
			console.log(`Words: ${words}`);
			console.log(`Characters: ${characters}`);
			resolve();
		});

		stream.on("error", reject);
	});
};
