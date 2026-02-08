#!/usr/bin/env bun
import { $ } from "bun";
import { Glob } from "bun";
import path from "path";

async function concurrent_foreach(iterable, generator, limit = 10) {
  const executing = new Set();
  const errors = [];

  for await (const item of iterable) {
    const p = (async () => {
      try {
        await generator(item);
      } catch (error) {
        errors.push({ item, error });
      }
    })().finally(() => executing.delete(p));

    executing.add(p);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);

  if (errors.length) {
    throw new Error("Errors occurred during foreach", { cause: errors });
  }
}

const proceduresDir = new URL("../procedures", import.meta.url).pathname;
const glob = new Glob("**/*.p");

let passed = 0;
let failed = 0;
const failures = [];

await concurrent_foreach(
  glob.scan(proceduresDir),
  async (file) => {
    const filepath = `${proceduresDir}/${file}`;
    const relativePath = path.relative(process.cwd(), filepath);

    const result = await $`tree-sitter parse ${filepath}`.quiet().nothrow();
    const output = result.stdout.toString();
    const hasError = output.includes("(ERROR") || output.includes("(MISSING");

    if (result.exitCode === 0 && !hasError) {
      passed++;
    } else {
      failed++;
      failures.push({ file: relativePath, output, exitCode: result.exitCode });
    }
  },
  50
);

if (failures.length > 0) {
  console.log("Failed:");
  for (const { file, output } of failures) {
    const lines = output.trim().split("\n").filter(Boolean);
    const lastLine = lines[lines.length - 1] || "(no output)";
    console.log(`${file}: ${lastLine}`);
  }
}

console.log(`\nResults: ${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
