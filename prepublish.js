import { $ } from "bun";

const ls = await $`git ls-files -v src/parser.c`;
const [status = "", file = ""] = ls.text()?.split(" ");

if (file.trim() !== "src/parser.c") {
  console.error("src/parser.c not found, aborting...");
  process.exit(1);
}

if (status.trim() !== "H") {
  console.error("src/parser.c is most likely skipped, undo worktree before deploying, aborting...");
  process.exit(1);
}

// Build parser
await $`tree-sitter generate`;

// Build artifacts
await Promise.all([
  // Build shared libraries
  $`tree-sitter build`,
  // Build wasm
  $`tree-sitter build -w`,
]);
