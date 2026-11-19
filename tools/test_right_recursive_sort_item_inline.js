import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { rightRecursiveSortItemInline } from "../oxlint/index.js";

const name = "right-recursive-sort-item-inline";
const key = 'field("field", $._qualified_identifier)';
const ascending = 'kw("ASCENDING", { offset: 3 })';
const descending = 'kw("DESCENDING", { offset: 4 })';
const directions = `choice(${descending}, ${ascending})`;
const sortOrder = `optional(field("sort_order", ${directions}))`;
const itemBody = `seq(${key}, ${sortOrder})`;
const use = "$.__index_key";
const tail = "optional($.__index_keys)";
const ownerBody = `prec.right(seq(${use}, ${tail}))`;
const item = `__index_key: ($) => ${itemBody},`;
const before = `export default ({ kw }) => ({
  ${item}
  __index_keys: ($) => ${ownerBody},
  index_definition: ($) => seq($._kw_index, $.__index_keys),
});`;
const after = before.replace(`${item}\n  `, "").replace(use, `${key}, ${sortOrder}`);
const directory = mkdtempSync(join(tmpdir(), "abl-right-recursive-sort-item-"));
const fixture = (label, code = before) => ({
  name: label,
  code,
  cwd: directory,
  filename: join(directory, "grammar", "statements", "index.js"),
});
const message =
  /only as the item of right-recursive.*inlining the qualified-name field and optional sort order/;
const warning = (label, code) => ({ ...fixture(label, code), errors: [{ message }] });
const suppress = (part, id) =>
  before.replace(part, `\n  // oxlint-disable-next-line ${id}\n  ${part}`);

try {
  mkdirSync(join(directory, "grammar", "statements"), { recursive: true });
  mkdirSync(join(directory, "grammar", "precedences"));
  writeFileSync(
    join(directory, "grammar.js"),
    "export default grammar({ conflicts: ($) => [[$.__conflicted_keys]], supertypes: ($) => [$.__super_key] });",
  );
  writeFileSync(
    join(directory, "grammar", "keywords.js"),
    "export const inline = ($) => [$.__inline_key];",
  );
  writeFileSync(
    join(directory, "grammar", "precedences", "index.js"),
    "export default ($) => [[$.__precedence_key, $.__precedence_keys]];",
  );
  writeFileSync(
    join(directory, "grammar", "statements", "consumer.js"),
    'export default ({ kw }) => ({ index_keys: ($) => seq(kw("READ"), $.__index_keys), remote: ($) => $["__externally_used_key"] });',
  );

  new RuleTester().run(name, rightRecursiveSortItemInline, {
    valid: [
      fixture("item already inlined", after),
      fixture("shared item", before.replaceAll(/\b__index_key\b/g, "_index_key")),
      fixture("public list owner", before.replaceAll("__index_keys", "index_keys")),
      fixture(
        "owner without right associativity",
        before.replace(ownerBody, `seq(${use}, ${tail})`),
      ),
      fixture("owner with left associativity", before.replace("prec.right", "prec.left")),
      fixture(
        "owner with named precedence",
        before.replace("prec.right(", 'prec.right("strong", '),
      ),
      fixture("mandatory recursion", before.replace(tail, "$.__index_keys")),
      fixture("different continuation", before.replace(tail, "optional($.__other)")),
      fixture("separated recursion", before.replace(tail, 'optional(seq(",", $.__index_keys))')),
      fixture("aliased item", before.replace(use, `alias(${use}, $.item)`)),
      fixture("field-wrapped item", before.replace(use, `field("item", ${use})`)),
      fixture(
        "item used by another rule",
        before.replace("  index_definition:", `  other: ($) => ${use},\n  index_definition:`),
      ),
      fixture("computed item use", before.replace(use, '$["__index_key"]')),
      fixture("computed additional use", `${before}\nconst lookup = ($) => $["__index_key"];`),
      fixture("dynamic rule lookup", `${before}\nconst lookup = ($, key) => $[key];`),
      fixture(
        "owner in local metadata",
        `${before}\nexport const inline = ($) => [$.__index_keys];`,
      ),
      fixture("item in local metadata", `${before}\nexport const inline = ($) => [$.__index_key];`),
      fixture(
        "item in keyword inline metadata",
        before.replaceAll(/\b__index_key\b/g, "__inline_key"),
      ),
      fixture("owner in root conflicts", before.replaceAll("__index_keys", "__conflicted_keys")),
      fixture("item in root supertypes", before.replaceAll(/\b__index_key\b/g, "__super_key")),
      fixture(
        "item in project precedence",
        before.replaceAll(/\b__index_key\b/g, "__precedence_key"),
      ),
      fixture(
        "owner in project precedence",
        before.replaceAll("__index_keys", "__precedence_keys"),
      ),
      fixture(
        "item used in another module",
        before.replaceAll(/\b__index_key\b/g, "__externally_used_key"),
      ),
      fixture("computed rule key", before.replace("__index_key:", '["__index_key"]:')),
      fixture("spread into rules", before.replace("=> ({", "=> ({ ...otherRules,")),
      fixture(
        "duplicate item key",
        before.replace(item, `${item}\n  __index_key: ($) => $.other,`),
      ),
      fixture("unqualified name", before.replace("$._qualified_identifier", "$.identifier")),
      fixture("optional qualified name", before.replace(key, `optional(${key})`)),
      fixture("missing key field", before.replace(key, "$._qualified_identifier")),
      fixture("same field name", before.replace('"field"', '"sort_order"')),
      fixture(
        "required sort order",
        before.replace(sortOrder, `field("sort_order", ${directions})`),
      ),
      fixture("different option field", before.replace('"sort_order"', '"format"')),
      fixture("non-keyword alternative", before.replace(ascending, "$.modifier")),
      fixture(
        "three keywords",
        before.replace(directions, `choice(${descending}, ${ascending}, kw("DEFAULT"))`),
      ),
      fixture(
        "duplicated keyword with different options",
        before.replace('"ASCENDING"', '"DESCENDING"'),
      ),
      fixture("dynamic keyword options", before.replace("offset: 3", "offset")),
      ...["__index_key:", "__index_keys:", key, directions, use, tail].map((part) =>
        fixture(`rule-specific suppression at ${part}`, suppress(part, `rule-to-test/${name}`)),
      ),
    ],
    invalid: [
      warning(
        "single-use item under right associativity with another module using the retained list",
      ),
      warning(
        "another local pair with the same shape",
        before.replace('"field"', '"column"').replaceAll("__index", "__sort"),
      ),
      warning(
        "unrelated suppression stays associated with the keyword choice",
        suppress(directions, "tree-sitter-optimize/inline-keyword-owner"),
      ),
    ],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
