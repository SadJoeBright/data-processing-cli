import readline from "node:readline";
import { MESSAGES, COMMANDS } from "./constants/index.js";
import * as navigation from "./navigation.js";
import * as commands from "./commands/index.js";

const getPromptText = () => `You are currently in ${process.cwd()}\n>`;

const goodbye = () => {
	console.log(MESSAGES.GOODBYE);
	process.exit(0);
};

const commandHandlers = {
	[COMMANDS.EXIT]: goodbye,
	[COMMANDS.UP]: () => navigation.up(),
	[COMMANDS.CD]: (pathArg) => navigation.cd(pathArg),
	[COMMANDS.LS]: () => navigation.ls(),
	[COMMANDS.COUNT]: (pathArg) => commands.count(pathArg),
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
			if (cmd) {
				const handler = commandHandlers[cmd];
				if (handler) {
					await handler(pathArg);
				} else {
					console.log(MESSAGES.INVALID_INPUT);
				}
			}
		} catch (err) {
			console.error(MESSAGES.OPERATION_FAILED);
		}

		rl.setPrompt(getPromptText());
		rl.prompt();
	});

	rl.on("close", goodbye);
	rl.on("SIGINT", goodbye);
};
