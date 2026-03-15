import readline from "node:readline";
import os from "node:os";
import { MESSAGES, COMMANDS } from "./constants/index.js";

const homeDirectory = os.homedir();

const goodbye = () => {
	console.log(MESSAGES.GOODBYE);
	process.exit(0);
};

const main = () => {

	process.chdir(homeDirectory);

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	console.log(MESSAGES.INITIAL);


	rl.setPrompt(`You are currently in ${process.cwd()}\n>`);
	rl.prompt();

	rl.on("line", (line) => {
		const cmd = line.trim().toLowerCase();

		try {
			switch (cmd) {
				case COMMANDS.EXIT:
					goodbye();
					return;
				case "date":
					console.log(new Date().toISOString());
					break;
				case "":
					break;
				default:
					console.log(MESSAGES.INVALID_INPUT);
			}
		} catch {
			console.log(MESSAGES.OPERATION_FAILED);
		}

		rl.prompt();
	});

	rl.on("close", goodbye);
	rl.on("SIGINT", goodbye);
};

main();