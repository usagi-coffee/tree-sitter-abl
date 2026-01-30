import * as Bun from "bun";
import { $ } from "bun";

const [, , ...args] = Bun.argv;

const proc = Bun.spawnSync({
  cmd: ["tree-sitter", "test", ...args],
  stdout: "pipe",
  stderr: "pipe",
});

const raw =
  (proc.stdout?.toString("utf8") ?? "") + (proc.stderr?.toString("utf8") ?? "");

const checkmarkCount = (raw.match(new RegExp("✓", "g")) || []).length;
const failureCount = (raw.match(new RegExp("✗", "g")) || []).length;
const hasCheckmark = raw.includes("✓");
const hasFailure = raw.includes("✗");

// otherwise continue with your existing logic
const lines = raw.split(/\r?\n/).filter((l) => !l.includes("✓"));

const keep = new Set();

const isHeader = (s) => s.trim().endsWith(":");
const indentLen = (s) => s.match(/^\s*/)?.[0].length ?? 0;

const firstHeaderIdx = lines.findIndex((l) => isHeader(l));
const failuresIdx = lines.findIndex((l) => /^\s*\d+\s+failures?:\s*$/.test(l));

const hasHeaderRegion = firstHeaderIdx !== -1;
const treeStart = hasHeaderRegion ? firstHeaderIdx : -1;
const treeEndExclusive = failuresIdx !== -1 ? failuresIdx : lines.length;

// keep everything outside header-tree region
for (let i = 0; i < lines.length; i++) {
  const inTree = hasHeaderRegion && i >= treeStart && i < treeEndExclusive;
  if (!inTree) keep.add(i);
}

// inside header-tree region, keep only failure branches
if (hasHeaderRegion) {
  for (let i = treeStart; i < treeEndExclusive; i++) {
    if (!lines[i].includes("✗")) continue;

    keep.add(i);

    let childIndent = indentLen(lines[i]);

    for (let j = i - 1; j >= treeStart; j--) {
      const line = lines[j];
      if (!isHeader(line)) continue;

      const ind = indentLen(line);
      if (ind < childIndent) {
        keep.add(j);
        childIndent = ind;
      }
      if (ind === 0) break;
    }
  }
}

// always keep failures summary
if (failuresIdx !== -1) {
  for (let j = failuresIdx; j < lines.length; j++) keep.add(j);
}

const result = lines
  .map((line, i) => (keep.has(i) ? line : null))
  .filter((v) => v !== null)
  .join("\n");

// if tests ran, had ✓, and no failures → print success and exit
if (hasCheckmark && !hasFailure) {
  console.log(`✓ All (${checkmarkCount}) tests passed successfully`);
  process.exit(0);
}

if (failureCount > 0) {
  console.error(`✗ ${failureCount} tests failed`);
}

console.log(result);
process.exit(1);
