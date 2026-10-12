import assert from "node:assert/strict";
import { kw } from "../grammar/helpers/keywords.js";

// Inspect the DSL emitted by kw independently of parser generation.
globalThis.token = (content) => ({ type: "token", content });
globalThis.alias = (content, name) => ({ type: "alias", name, content });
globalThis.prec = (value, content) => ({ type: "prec", value, content });
try {
  const ordinary = kw("&ENDIF");
  assert.equal(ordinary.name, "&ENDIF");
  assert.equal(ordinary.content.type, "token");
  assert.equal(ordinary.content.content.source, "&ENDIF");
  assert(ordinary.content.content.test("&endif"));
  const preferred = kw("&GLOBAL-DEFINE", { precedence: "keyword" });
  assert.equal(preferred.content.content.type, "prec");
  assert.equal(preferred.content.content.value, 1);
  assert(preferred.content.content.content.test("&Global-Define"));
  const unaliased = kw("&THEN", { precedence: "keyword", alias: false });
  assert.equal(unaliased.type, "token");
  assert.equal(unaliased.content.type, "prec");
  assert.equal(kw("IF", { alias: false }).type, "token");
  const partial = kw("DEFINE", { offset: 3, precedence: "keyword", alias: "DEF" });
  assert.equal(partial.name, "DEF");
  const pattern = new RegExp(`^(?:${partial.content.content.content.source})$`, "i");
  assert(pattern.test("def"));
  assert(pattern.test("define"));
  assert(!pattern.test("de"));
  assert.throws(() => kw("IF", { precedence: "unknown" }), /Unknown keyword lexical precedence/);
  assert.throws(() => kw("IF", { precedence: "toString" }), /Unknown keyword lexical precedence/);
} finally {
  delete globalThis.token;
  delete globalThis.alias;
  delete globalThis.prec;
}
