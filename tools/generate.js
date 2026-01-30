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
const prevHash = await Bun.file("abl.hash")
  .text()
  .catch(() => "");

if (hash !== prevHash) {
  try {
    await $`tree-sitter generate`;
  } catch (error) {
    process.exit(1);
  }

  await Bun.write("abl.hash", hash);
}

const proc = Bun.spawnSync({
  cmd: ["tree-sitter", "test"],
  stdout: "pipe",
  stderr: "pipe",
});

const text = await Bun.file("src/parser.c").text();
let highest = -Infinity;
const matches = text.match(/ACTIONS\((\d+)\)/g) || [];

for (const m of matches) {
  const value = Number(m.match(/\d+/)[0]);
  if (value > highest) highest = value;
}

console.log(`#define ACTION_COUNT ${highest}`);

await $`grep -E "#define.*STATE_COUNT" src/parser.c`;
if (proc.stdout + proc.stderr === "") {
  console.error(
    "Parser failed internally and returned no output, this indicates some rule broke the parser (tests are not the issue), try to revert your latest changes until you see an output. This is a confirmed parser bug, don't investigate into this error."
  );
  process.exit(1);
}
