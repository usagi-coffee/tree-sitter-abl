// Estimate the dominant Wasm32 static tables without compiling the parser.
// Excludes small metadata/string tables, alignment, scanner allocations, runtime
// stack/heap, and other grammars. This is not a WasmStore limit check.
export function estimateWasmMemory(source) {
  const constant = (name) => {
    const match = source.match(new RegExp(`^#define ${name} (\\d+)$`, "m"));
    if (!match) throw new Error(`Missing parser constant ${name}`);
    return Number(match[1]);
  };
  const body = (name) => {
    const start = source.indexOf(`${name}[] = {`);
    if (start < 0) throw new Error(`Missing parser table ${name}`);
    const end = source.indexOf("\n};", start);
    if (end < 0) throw new Error(`Unterminated parser table ${name}`);
    return source.slice(source.indexOf("{", start) + 1, end);
  };
  const states = constant("STATE_COUNT");
  const largeStates = constant("LARGE_STATE_COUNT");
  const symbols = constant("SYMBOL_COUNT");
  const smallTable = body("ts_small_parse_table");
  const indexes = [...smallTable.matchAll(/\[(\d+)\]\s*=/g)];
  const last = indexes.at(-1);
  if (!last) throw new Error("Missing sparse-table offsets");
  // The final designated offset plus its remaining scalar initializers gives
  // the full array extent, including gaps. ACTIONS/STATE each emit one uint16.
  const tail = smallTable.slice(last.index + last[0].length);
  const sparseEntries = Number(last[1]) + tail.split(",").filter((s) => s.trim()).length;
  let actionEntries = 0;
  for (const match of body("ts_parse_actions").matchAll(
    /\[(\d+)\]\s*=\s*\{\.entry\s*=\s*\{\.count\s*=\s*(\d+)/g,
  )) {
    actionEntries = Math.max(actionEntries, Number(match[1]) + 1 + Number(match[2]));
  }
  if (!actionEntries) throw new Error("Missing parse actions");
  // Wasm32 parser.h: uint16=2, uint32=4, TSParseActionEntry=8,
  // TSLexerMode=6, TSStateId=2, TSMapSlice=4.
  const denseBytes = 2 * largeStates * symbols;
  const bytes =
    denseBytes +
    2 * sparseEntries +
    4 * (states - largeStates) +
    8 * actionEntries +
    8 * states +
    constant("PRODUCTION_ID_COUNT") * (4 + 2 * constant("MAX_ALIAS_SEQUENCE_LENGTH"));
  return { bytes, mib: bytes / (1024 * 1024), denseBytes };
}
