#!/usr/bin/env bun
import { $ } from "bun";

const snippet = process.argv[2];
if (!snippet) {
  console.error("Missing file argument");
  process.exit(1);
}

try {
// run parser
await $`tree-sitter parse ${snippet}`;
} catch (error) {}
