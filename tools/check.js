import { $ } from "bun";

await $`grep -E "#define.*STATE_COUNT" src/parser.c`;
