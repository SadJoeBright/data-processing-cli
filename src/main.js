import os from "node:os";
import { start } from "./repl.js";

const homeDirectory = os.homedir();

// Set initial navigation state: working directory = user's home
process.chdir(homeDirectory);

start();
