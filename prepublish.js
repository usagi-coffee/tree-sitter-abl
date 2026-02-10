import { $ } from "bun";

async function check_skipped(src) {
  const ls = await $`git ls-files -v ${src}`;
  const [status = "", file = ""] = ls.text()?.split(" ");

  if (file.trim() !== src) {
    console.error(`${src} not found, aborting...`);
    process.exit(1);
  }

  if (status.trim() !== "H") {
    console.error(
      `${src} is most likely skipped, undo worktree before deploying, aborting...`
    );

    process.exit(1);
  }
}

await check_skipped("src/parser.c");
await check_skipped("src/grammar.json");
await check_skipped("src/node-types.json");

const { exitCode } = await $`npm whoami`;
if (exitCode !== 0) {
  console.error("Authenticate on npm before publishing");
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
