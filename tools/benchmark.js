#!/usr/bin/env bun

import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const corpusPath = resolve(process.argv[2] ?? "tools/benchmark.p");
const runs = 3;
const speeds = [];

const env = { ...process.env, XDG_CACHE_HOME: "/tmp/tree-sitter-cache" };

function parse(rebuild) {
  return spawnSync(
    "tree-sitter",
    ["parse", "--time", "--stat", "--quiet", corpusPath],
    { encoding: "utf8", env }
  );
}

const generate = spawnSync("bun", ["run", "generate"], {
  encoding: "utf8",
  env,
});
if (generate.status !== 0) {
  process.stdout.write(`${generate.stdout ?? ""}${generate.stderr ?? ""}`);
  process.exit(generate.status ?? 1);
}

const build = parse(true);
if (build.status !== 0) {
  process.stdout.write(`${build.stdout ?? ""}${build.stderr ?? ""}`);
  process.exit(build.status ?? 1);
}

for (let run = 1; run <= runs; run += 1) {
  const result = parse(false);
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  process.stdout.write(output);

  if (result.status !== 0) process.exit(result.status ?? 1);
  const match = output.match(/Parse:\s+[\d.]+ ms\s+([\d.]+) bytes\/ms/);
  if (!match || /failed parses:\s*[1-9]/.test(output)) {
    console.error(`Benchmark run ${run} did not produce a successful parse.`);
    process.exit(1);
  }
  speeds.push(Number(match[1]));
}

const average = speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;
console.log(`Average (${runs} runs): ${average.toFixed(2)} bytes/ms`);
