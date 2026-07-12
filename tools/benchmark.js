#!/usr/bin/env bun

const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { performance } = require("node:perf_hooks");

// The dependencies are built locally with node-gyp. Their Bun loader expects
// unavailable prebuilt binaries, so select the compatible local-addon path.
delete process.versions.bun;
const Parser = require("tree-sitter");
const abl = require("../bindings/node");

const RUNS = 3;
const corpusPath = resolve(process.argv[2] ?? "benchmarks/corpus.abl");
const source = readFileSync(corpusPath, "utf8");
const parser = new Parser();
parser.setLanguage(abl);

const durations = [];
for (let run = 0; run < RUNS; run += 1) {
  const startedAt = performance.now();
  parser.parse(source);
  const duration = performance.now() - startedAt;
  durations.push(duration);
  console.log(`Run ${run + 1}: ${duration.toFixed(2)} ms`);
}

const average = durations.reduce((total, duration) => total + duration, 0) / RUNS;
console.log(`Average (${RUNS} runs): ${average.toFixed(2)} ms`);
