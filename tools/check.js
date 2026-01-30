import { $ } from "bun";

const text = await Bun.file("src/parser.c").text();
let highest = -Infinity;
const matches = text.match(/ACTIONS\((\d+)\)/g) || [];

for (const m of matches) {
  const value = Number(m.match(/\d+/)[0]);
  if (value > highest) highest = value;
}

console.log(`#define ACTION_COUNT ${highest}`);
await $`grep -E "#define.*STATE_COUNT" src/parser.c`;
