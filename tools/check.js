import { $ } from "bun";

const parserFile = Bun.file("src/parser.c");
const text = await parserFile.text();
const parserSizeBytes = parserFile.size;
const parserSizeMiB = (parserSizeBytes / (1024 * 1024)).toFixed(2);
let highest = -Infinity;
const matches = text.match(/ACTIONS\((\d+)\)/g) || [];

for (const m of matches) {
  const value = Number(m.match(/\d+/)[0]);
  if (value > highest) highest = value;
}

console.log(`#define ACTION_COUNT ${highest}`);
await $`grep -E "#define.*STATE_COUNT" src/parser.c`;
console.log(`#define PARSER_C_SIZE_BYTES ${parserSizeBytes}`);
console.log(`#define PARSER_C_SIZE_MIB ${parserSizeMiB}`);
