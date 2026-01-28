import { $ } from "bun";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

const hasher = new Bun.CryptoHasher("sha256");

// Hash grammar.js
const grammarJs = await Bun.file("grammar.js").arrayBuffer();
hasher.update(new Uint8Array(grammarJs));

// Hash all files in grammar/ directory
const grammarDir = "grammar";
try {
  const grammarFiles = await readdir(grammarDir);
  for (const file of grammarFiles.sort()) {
    const content = await Bun.file(join(grammarDir, file)).arrayBuffer();
    hasher.update(new Uint8Array(content));
  }
} catch {
  // grammar directory might not exist
}

// Hash src/scanner.c
try {
  const scannerC = await Bun.file("src/scanner.c").arrayBuffer();
  hasher.update(new Uint8Array(scannerC));
} catch {
  // scanner.c might not exist
}

const currentHash = hasher.digest("hex");

// Check if hash changed
let previousHash = "";
try {
  previousHash = (await Bun.file("abl.hash").text()).trim();
} catch {
  // file doesn't exist
}

if (currentHash === previousHash) {
  process.exit(0);
}

// Run tree-sitter generate
await $`tree-sitter generate`;

// Write new hash
await Bun.write("abl.hash", currentHash);
