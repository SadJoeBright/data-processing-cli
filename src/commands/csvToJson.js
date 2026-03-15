import path from "node:path";
import { createReadStream, createWriteStream } from "node:fs";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { MESSAGES } from "../constants/index.js";

const INPUT_ARGUMENT = "--input";
const OUTPUT_ARGUMENT = "--output";

const parseArgs = (userInput) => {
	const raw = userInput.trim();
	const inputMatch = raw.match(new RegExp(`${INPUT_ARGUMENT}\\s+(\\S+)`));
	const outputMatch = raw.match(new RegExp(`${OUTPUT_ARGUMENT}\\s+(\\S+)`));
	const inputPath = inputMatch?.[1]?.trim();
	const outputPath = outputMatch?.[1]?.trim();

	return { inputPath, outputPath };
}

const createCsvToJsonTransform = () => {
	let buffer = "";
	let headers = null;
	const rows = [];

	return new Transform({
		transform(chunk, _enc, callback) {
			buffer += chunk;
			const lines = buffer.split("\n");
			buffer = lines.pop() ?? "";

			for (const line of lines) {
				if (line.trim() === "") continue;
				const values = line.split(",").map((value) => value.trim());
				if (headers === null) {
					headers = values;
				} else {
					const obj = {};
					headers.forEach((key, index) => {
						obj[key] = values[index] ?? "";
					});
					rows.push(obj);
				}
			}
			callback();
		},
		flush(callback) {
			if (buffer.trim() !== "" && headers !== null) {
				const values = buffer.split(",").map((value) => value.trim());
				const obj = {};
				headers.forEach((key, index) => {
					obj[key] = values[index] ?? "";
				});
				rows.push(obj);
			}
			const json = JSON.stringify(rows, null, 2);
			this.push(json);
			callback();
		},
	});
};

export const csvToJson = (userInput) => {
	const { inputPath, outputPath } = parseArgs(userInput);

	if (!inputPath || !outputPath) {
		return Promise.resolve();
	}

	const inputFilePath = path.resolve(process.cwd(), inputPath);
	const outputFilePath = path.resolve(process.cwd(), outputPath);

	const readStream = createReadStream(inputFilePath, { encoding: "utf8" });
	const transformStream = createCsvToJsonTransform();
	const writeStream = createWriteStream(outputFilePath, { encoding: "utf8" });

	return pipeline(readStream, transformStream, writeStream);
};
