#!/usr/bin/env bun
/**
 * Build one ABL source file from every Tree-sitter corpus test's source block.
 *
 * Usage:
 *   bun run benchmark:corpus
 *   bun run benchmark:corpus -- benchmarks/corpus.abl
 */

import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";

const CORPUS_DIRECTORY = "test/corpus";
const DEFAULT_OUTPUT = "benchmarks/corpus.abl";
const RE_HEADING = /^=+\s*$/;
const RE_SEPARATOR = /^(?:=+|-+)\s*$/;

async function corpusFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return corpusFiles(path);
      return entry.isFile() && entry.name.endsWith(".txt") ? [path] : [];
    }),
  );
  return files.flat().sort();
}

function sourceBlocks(text) {
  const lines = text.split(/\r?\n/);
  const blocks = [];

  for (let index = 0; index + 2 < lines.length; index += 1) {
    if (!RE_HEADING.test(lines[index]) || !RE_HEADING.test(lines[index + 2])) continue;

    const name = lines[index + 1].trim();
    index += 3;
    const source = [];
    while (index < lines.length && !RE_SEPARATOR.test(lines[index])) {
      source.push(lines[index]);
      index += 1;
    }

    const code = source.join("\n").trim();
    if (code) blocks.push({ name, code });

    while (index < lines.length && !RE_HEADING.test(lines[index])) index += 1;
    index -= 1;
  }

  return blocks;
}

async function main() {
  const output = process.argv[2] ?? DEFAULT_OUTPUT;
  const files = await corpusFiles(CORPUS_DIRECTORY);
  const sections = [];
  let testCount = 0;

  for (const file of files) {
    const blocks = sourceBlocks(await readFile(file, "utf8"));
    const fileLabel = relative(CORPUS_DIRECTORY, file);
    for (const { name, code } of blocks) {
      sections.push(`/* ${fileLabel}: ${name} */\n${code}`);
      testCount += 1;
    }
  }

  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, `${sections.join("\n\n")}\n`, "utf8");
  console.log(`Wrote ${output} from ${testCount} tests in ${files.length} corpus files.`);
}

main().catch((error) => {
  console.error(error?.stack ?? String(error));
  process.exit(1);
});
