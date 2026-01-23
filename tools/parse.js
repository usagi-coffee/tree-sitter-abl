#!/usr/bin/env bun
import { $ } from "bun";

const snippet = process.argv[2];
if (!snippet) {
  console.error("Missing snippet argument");
  process.exit(1);
}

const tmp = `/tmp/abl-${crypto.randomUUID()}.p`;
await Bun.write(tmp, snippet + "\n");

try {
// run parser
await $`tree-sitter parse ${tmp}`;
} catch (error) {}
