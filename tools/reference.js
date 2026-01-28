import { readFileSync } from "fs";

let entry = process.argv[2];
if (!entry) {
  console.error('Usage: bun run reference "entry"');
  process.exit(1);
}

const lines = readFileSync("./docs/abl-reference.txt", "utf8").split(/\r?\n/);
const TITLE = "OpenEdge Development: ABL Reference: Version 12.8";
const TOC1 = "Table of Contents";
const TOC2 = "Contents";
const tocRe = /^\s*(.+?)\.{5,}\s*(\d+)\s*$/;

let toc = [];
let inToc = false;
let seenAny = false;
let nonTocStreak = 0;

for (let i = 0; i < lines.length; i++) {
  const t = lines[i].trim();

  if (!inToc) {
    if (t === TOC1) inToc = true;
    continue;
  }

  if (t === TOC2 || t === TITLE || t === "" || t === "\f") continue;

  const m = lines[i].match(tocRe);
  if (m) {
    seenAny = true;
    nonTocStreak = 0;
    toc.push({ title: m[1].trim().toLowerCase(), page: Number(m[2]) });
  } else if (seenAny) {
    nonTocStreak++;
    if (nonTocStreak >= 50) break;
  }
}

if (!toc.length) {
  console.error('No TOC entries found after "Table of Contents".');
  process.exit(1);
}

entry = entry.toLowerCase();
const isPrefix = entry.endsWith("*");
const isSuffix = entry.startsWith("*");

let matches = [];

if (isPrefix && isSuffix) {
  const phrase = entry.slice(0, -1).slice(1);
  matches = toc.filter((x) => x.title.includes(phrase));
} else if (isPrefix) {
  const prefix = entry.slice(0, -1);
  matches = toc.filter((x) => x.title.startsWith(prefix));
} else if (isSuffix) {
  const suffix = entry.slice(1);
  matches.push(...toc.filter((x) => x.title.endsWith(suffix)));
}

if (isPrefix || isSuffix) {
  if (!matches.length) {
    console.error(`No TOC entries match: "${entry}"`);
    process.exit(1);
  }
  for (const m of matches) console.log(`${m.title}`);
  process.exit(0);
}

// ---- normal single-entry behavior (exact first, then substring fallback if you still want it)
let idx = toc.findIndex((x) => x.title === entry);
if (idx === -1) idx = toc.findIndex((x) => x.title.includes(entry));
if (idx === -1) {
  console.error(`Entry not found in TOC: "${entry}"`);
  process.exit(1);
}

entry = toc[idx].title;
const start_page = toc[idx].page;
const next_entry = toc[idx + 1]?.title ?? null;
const next_entry_page = toc[idx + 1]?.page ?? Infinity;
// console.log(entry, start_page, next_entry, next_entry_page);

let page = 0;
let capturing = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line === TITLE) {
    const fwd = +lines[i + 2];
    const back = +lines[i - 2];

    if (Number.isInteger(fwd)) page = +fwd;
    else if (Number.isInteger(back)) page = +back;
    else continue;
  }

  if (page + 1 < start_page) continue;
  if (page > next_entry_page) break;

  if (!capturing) {
    if (line.toLowerCase() === entry.toLowerCase()) capturing = true;
  }

  if (line.toLowerCase() === next_entry.toLowerCase()) break;

  if (capturing) {
    if (line.startsWith("\f") || line === TITLE || (line && !isNaN(+line)))
      continue;
    console.log(line);
  }
}
