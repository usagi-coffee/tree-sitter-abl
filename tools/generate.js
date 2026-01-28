// Skip tree-sitter generate if grammar.js, grammar/*, and src/scanner.c haven't changed
import { $ } from "bun";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

const hasher = new Bun.CryptoHasher("sha256");

const hashFile = async (path) => {
  try {
    hasher.update(new Uint8Array(await Bun.file(path).arrayBuffer()));
  } catch {}
};

await hashFile("grammar.js");
await hashFile("src/scanner.c");

try {
  for (const file of (await readdir("grammar", { recursive: true })).sort())
    await hashFile(join("grammar", file));
} catch {}

const hash = hasher.digest("hex");
const prevHash = await Bun.file("abl.hash").text().catch(() => "");

if (hash === prevHash) process.exit(0);

await $`tree-sitter generate`;
await Bun.write("abl.hash", hash);
