import readline from "node:readline";
import { MESSAGES, COMMANDS } from "./constants/index.js";
import * as navigation from "./navigation.js";

const getPromptText = () => `You are currently in ${process.cwd()}\n>`;

const goodbye = () => {
	console.log(MESSAGES.GOODBYE);
	process.exit(0);
};

export const start = () => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	console.log(MESSAGES.INITIAL);
	rl.setPrompt(getPromptText());
	rl.prompt();

	rl.on("line", async (line) => {
		const trimmed = line.trim();
		const spaceIndex = trimmed.indexOf(" ");
		const cmd = (spaceIndex === -1 ? trimmed : trimmed.slice(0, spaceIndex)).toLowerCase();
		const pathArg = spaceIndex === -1 ? "" : trimmed.slice(spaceIndex + 1).trim();

		try {
			switch (cmd) {
				case COMMANDS.EXIT:
					goodbye();
					return;
				case COMMANDS.UP:
					navigation.up();
					break;
				case COMMANDS.CD:
					navigation.cd(pathArg);
					break;
				case COMMANDS.LS:
					await navigation.ls();
					break;
				case "":
					break;
				default:
					console.log(MESSAGES.INVALID_INPUT);
			}
		} catch {
			console.error(MESSAGES.OPERATION_FAILED);
		}

		rl.setPrompt(getPromptText());
		rl.prompt();
	});

	rl.on("close", goodbye);
	rl.on("SIGINT", goodbye);
};
