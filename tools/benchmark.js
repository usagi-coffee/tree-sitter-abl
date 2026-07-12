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
const corpusPath = resolve(process.argv[2] ?? "tools/benchmark.p");
const source = readFileSync(corpusPath, "utf8");
const parser = new Parser();
parser.setLanguage(abl);

const durations = [];
let totalParsedBytes = 0;
for (let run = 0; run < RUNS; run += 1) {
  const startedAt = performance.now();
  const tree = parser.parse(source);
  const duration = performance.now() - startedAt;
  const parsedBytes = tree.rootNode.endIndex - tree.rootNode.startIndex;
  durations.push(duration);
  totalParsedBytes += parsedBytes;
  console.log(
    `Run ${run + 1}: ${duration.toFixed(2)} ms (${(parsedBytes / duration).toFixed(2)} bytes/ms)`,
  );
}

const totalDuration = durations.reduce((total, duration) => total + duration, 0);
const averageDuration = totalDuration / RUNS;
const averageParseRate = totalParsedBytes / totalDuration;
console.log(
  `Average (${RUNS} runs): ${averageDuration.toFixed(2)} ms (${averageParseRate.toFixed(2)} bytes/ms)`,
);
