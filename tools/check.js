import { $ } from "bun";

const text = await Bun.file("src/parser.c").text();

const highest = Math.max(
  ...(text.match(/ACTIONS\((\d+)\)/g) || []).map((m) =>
    Number(m.match(/\d+/)[0])
  )
);

console.log(`#define ACTION_COUNT ${highest}`);
await $`grep -E "#define.*STATE_COUNT" src/parser.c`;
