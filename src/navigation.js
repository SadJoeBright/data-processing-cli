import fs from "node:fs/promises";

export const up = () => {
	process.chdir("..");
};

export const cd = (path) => {
	process.chdir(path);
};

export const ls = async () => {
	const dirents = await fs.readdir(process.cwd(), { withFileTypes: true });
	const sorted = [...dirents].sort((a, b) => {
		if (a.isDirectory() !== b.isDirectory()) {
			return a.isDirectory() ? -1 : 1;
		}
		return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
	});
	const maxNameLen = Math.max(0, ...sorted.map((d) => d.name.length));
	for (const dirent of sorted) {
		const type = dirent.isDirectory() ? "folder" : "file";
		console.log(`${dirent.name.padEnd(maxNameLen)}  [${type}]`);
	}
};
