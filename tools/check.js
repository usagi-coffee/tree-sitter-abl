import { $ } from "bun";

console.log('Current state:');
await $`grep -E "#define.*STATE_COUNT" src/parser.c`;
