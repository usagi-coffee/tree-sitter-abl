// Skip tree-sitter generate if grammar.js, grammar/*, and src/scanner.c haven't changed
// If generate fails, annotate the error using token literals from src/parser.c (when available)

import { $ } from "bun";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { readFileSync } from "node:fs";

const hasher = new Bun.CryptoHasher("sha256");

const hashFile = async (path) => {
  try {
    hasher.update(new Uint8Array(await Bun.file(path).arrayBuffer()));
  } catch {}
};

await hashFile("grammar.js");
await hashFile("src/scanner.c");

try {
  for (const file of (await readdir("grammar", { recursive: true })).sort()) {
    await hashFile(join("grammar", file));
  }
} catch {}

const hash = hasher.digest("hex");
const prevHash = await Bun.file("abl.hash")
  .text()
  .catch(() => "");

function loadTokenMap(parserCText) {
  const map = new Map();
  const re = /\[\s*([A-Za-z0-9_]+)\s*\]\s*=\s*"([^"]*)"/g;

  let m;
  while ((m = re.exec(parserCText)) !== null) {
    const sym = m[1];
    const lit = m[2];

    map.set(sym, lit);

    const noPrefix = sym.replace(/^(aux_sym_|sym_)/, "");
    map.set(noPrefix, lit);

    // sym___foo_token1 -> __foo_token1
    if (noPrefix.startsWith("___")) map.set(noPrefix.slice(1), lit);

    if (noPrefix.startsWith("__")) map.set(noPrefix, lit);
  }

  return map;
}

function annotate(text, tokenMap) {
  const tokenNameRe =
    /'(__[A-Za-z0-9_]*token\d+)'|(\b(?:aux_sym_|sym_)?__?[A-Za-z0-9_]*token\d+\b)/g;

  return text.replace(tokenNameRe, (full, q, b) => {
    const name = q || b;
    const lit = tokenMap.get(name);
    if (!lit) return full;
    const rendered = q ? `'${name}'` : name;
    return `${rendered}{"${lit}"}`;
  });
}

function prettifySymbolSequences(text) {
  const lines = text.split(/\r?\n/);
  const out = [];

  for (let i = 0; i < lines.length; i++) {
    out.push(lines[i]);
    if (/symbol sequence:/i.test(lines[i])) {
      i++;
      for (; i < lines.length; i++) {
        if (lines[i].trim() === "") {
          out.push(lines[i]);
          break;
        }
        out.push("  " + lines[i]);
      }
    }
  }
  return out.join("\n");
}

function tryAnnotateGenerateError(raw) {
  // Best-effort: parser.c exists only after a successful generate.
  // If it's missing/stale, just return raw.
  try {
    const parserCText = readFileSync("src/parser.c", "utf8");
    const tokenMap = loadTokenMap(parserCText);
    return prettifySymbolSequences(annotate(raw, tokenMap));
  } catch {
    return raw;
  }
}

if (hash !== prevHash) {
  // Use spawnSync so we can always capture stderr/stdout without Bun throwing
  const gen = Bun.spawnSync({
    cmd: ["tree-sitter", "generate"],
    stdout: "pipe",
    stderr: "pipe",
  });

  const genOut = gen.stdout ? Buffer.from(gen.stdout).toString("utf8") : "";
  const genErr = gen.stderr ? Buffer.from(gen.stderr).toString("utf8") : "";

  if (gen.exitCode !== 0) {
    const combined = (genErr || "") + (genOut ? `\n${genOut}` : "");
    process.stderr.write(tryAnnotateGenerateError(combined));
    process.exit(gen.exitCode ?? 1);
  }

  await Bun.write("abl.hash", hash);
}

const proc = Bun.spawnSync({
  cmd: ["tree-sitter", "test"],
  stdout: "pipe",
  stderr: "pipe",
});

const testOut = proc.stdout ? Buffer.from(proc.stdout).toString("utf8") : "";
const testErr = proc.stderr ? Buffer.from(proc.stderr).toString("utf8") : "";

const text = await Bun.file("src/parser.c").text();
let highest = -Infinity;
const matches = text.match(/ACTIONS\((\d+)\)/g) || [];

for (const m of matches) {
  const value = Number(m.match(/\d+/)?.[0] ?? NaN);
  if (!Number.isNaN(value) && value > highest) highest = value;
}

console.log(`#define ACTION_COUNT ${highest}`);

await $`grep -E "#define.*STATE_COUNT" src/parser.c`;

if ((testOut + testErr).trim() === "") {
  console.error(
    "Parser failed internally and returned no output, this indicates some rule broke the parser (tests are not the issue), try to revert your latest changes until you see an output. This is a confirmed parser bug, don't investigate into this error."
  );
  process.exit(1);
}
