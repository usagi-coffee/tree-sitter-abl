#!/usr/bin/env bun
/**
 * Extract only the source-code portions from a Tree-sitter corpus test file.
 *
 * Common corpus format:
 * ==================
 * Test name
 * ==================
 * <code...>
 * ---
 * (<expected s-expression...>)
 * ===
 *
 * Prints concatenated code blocks (separated by a blank line) to stdout,
 * or writes each block to separate files if --out-dir is provided.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const RE_HEADING_LINE = /^=+\s*$/;
const RE_SEPARATOR_EQ = /^===+\s*$/;
const RE_SEPARATOR_DASH = /^---+\s*$/;

function safeFilename(name) {
  let s = name.trim();
  s = s.replace(/[^\w\-. ]+/g, "_");
  s = s.replace(/\s+/g, "_");
  if (!s) s = "test";
  return s.slice(0, 150);
}

/**
 * @param {string} text
 * @returns {{name: string, code: string}[]}
 */
function extractCodeBlocks(text) {
  const lines = text.split(/\r?\n/);
  const n = lines.length;
  let i = 0;
  /** @type {{name: string, code: string}[]} */
  const results = [];

  while (i < n) {
    if (!RE_HEADING_LINE.test(lines[i])) {
      i += 1;
      continue;
    }

    // Expect:
    // =====
    // name
    // =====
    if (i + 2 >= n || !RE_HEADING_LINE.test(lines[i + 2])) {
      i += 1;
      continue;
    }

    const testName = (lines[i + 1] ?? "").trim();
    i += 3;

    const codeLines = [];
    while (i < n && !RE_SEPARATOR_DASH.test(lines[i]) && !RE_SEPARATOR_EQ.test(lines[i])) {
      codeLines.push(lines[i]);
      i += 1;
    }

    const code = codeLines.join("\n").replace(/\n+$/, "");
    results.push({ name: testName, code });

    // Skip expected section until '===' or next header.
    while (i < n) {
      if (RE_SEPARATOR_EQ.test(lines[i])) {
        i += 1;
        break;
      }
      if (RE_HEADING_LINE.test(lines[i]) && i + 2 < n && RE_HEADING_LINE.test(lines[i + 2])) {
        break;
      }
      i += 1;
    }
  }

  return results;
}

function parseArgs(argv) {
  // bun argv includes: [bun, script, ...]
  const args = argv.slice(2);
  /** @type {{path?: string, outDir?: string, ext: string, keepEmpty: boolean}} */
  const opts = { ext: ".txt", keepEmpty: false };

  for (let i = 0; i < args.length; i++) {
    const a = args[i];

    if (!a.startsWith("--") && !opts.path) {
      opts.path = a;
      continue;
    }

    if (a === "--out-dir") {
      opts.outDir = args[++i];
      continue;
    }
    if (a === "--ext") {
      opts.ext = args[++i] ?? opts.ext;
      continue;
    }
    if (a === "--keep-empty") {
      opts.keepEmpty = true;
      continue;
    }
    if (a === "--help" || a === "-h") {
      return { ...opts, help: true };
    }

    throw new Error(`Unknown arg: ${a}`);
  }

  return opts;
}

function usage() {
  console.log(
    [
      "Usage:",
      "  bun extract_ts_corpus_code.js <path> [--out-dir <dir>] [--ext .txt] [--keep-empty]",
      "",
      "Examples:",
      "  bun extract_ts_corpus_code.js test/corpus/foo.txt",
      "  bun extract_ts_corpus_code.js test/corpus/foo.txt --out-dir out --ext .src",
    ].join("\n"),
  );
}

async function main() {
  const opts = parseArgs(process.argv);
  if (opts.help || !opts.path) {
    usage();
    process.exit(opts.path ? 0 : 2);
  }

  const text = await readFile(opts.path, "utf8");
  let blocks = extractCodeBlocks(text);

  if (!opts.keepEmpty) {
    blocks = blocks.filter((b) => b.code.trim() !== "");
  }

  if (!opts.outDir) {
    for (let i = 0; i < blocks.length; i++) {
      if (i !== 0) process.stdout.write("\n");
      process.stdout.write(blocks[i].code + "\n");
    }
    return;
  }

  await mkdir(opts.outDir, { recursive: true });

  /** @type {Record<string, number>} */
  const used = {};
  for (const b of blocks) {
    const base = safeFilename(b.name);
    const idx = used[base] ?? 0;
    used[base] = idx + 1;

    const file = `${base}${idx === 0 ? "" : `_${idx}`}${opts.ext}`;
    const outPath = join(opts.outDir, file);
    const content = b.code + (b.code && !b.code.endsWith("\n") ? "\n" : "");
    await writeFile(outPath, content, "utf8");
  }
}

main().catch((err) => {
  console.error(err?.stack || String(err));
  process.exit(1);
});

