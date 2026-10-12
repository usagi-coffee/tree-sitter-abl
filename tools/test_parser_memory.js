import assert from "node:assert/strict";
import { estimateWasmMemory } from "./parser_memory.js";

const source = `
#define STATE_COUNT 5
#define LARGE_STATE_COUNT 2
#define SYMBOL_COUNT 10
#define PRODUCTION_ID_COUNT 3
#define MAX_ALIAS_SEQUENCE_LENGTH 2
static const uint16_t ts_small_parse_table[] = {
  [0] = 1, ACTIONS(2), 1, sym_a,
  [8] = 1, STATE(3), 1, sym_b,
};
static const TSParseActionEntry ts_parse_actions[] = {
  [0] = {.entry = {.count = 0, .reusable = false}},
  [1] = {.entry = {.count = 2, .reusable = false}}, SHIFT(2), SHIFT(3),
};
`;
const result = estimateWasmMemory(source);
assert.equal(result.denseBytes, 40);
// Dense 40 + sparse 24 + sparse map 12 + actions 32 + state maps 40 + aliases 24.
assert.equal(result.bytes, 172);
assert.equal(result.mib, 172 / 1048576);
assert.throws(
  () => estimateWasmMemory(source.replace("#define STATE_COUNT 5", "")),
  /Missing parser constant/,
);
assert.throws(
  () => estimateWasmMemory(source.replace("ts_small_parse_table", "missing")),
  /Missing parser table/,
);
console.log("Parser memory estimate tests passed");
