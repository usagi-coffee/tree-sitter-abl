import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { selectorFrameSuffix } from "../oxlint/index.js";

const ruleId = "selector-frame-suffix";
const owner = "__disable_body";
const selector = "__disable_items";
const list = "__disable_items_list";
const item = "__disable_item";
const ownerUse = `optional($.${owner})`;
const all = 'seq(alias(kw("ALL"), $.all), optional($._except_fields))';
const frame = "optional($.frame_phrase)";
const aliasedItem = `alias($.${item}, $.disable_item)`;
const itemBody =
  'choice(seq(field("field", $._identifier_or_array_access), optional($._when_phrase)), alias($._kw_skip, $.skip))';
const continuation = `optional($.${list})`;
const before = `export default ({ kw }) => ({
  disable_statement: ($) => seq($._kw_disable, ${ownerUse}, $._terminator),
  ${owner}: ($) => seq(
    optional(alias(kw("UNLESS-HIDDEN"), $.unless_hidden)),
    $.${selector},
    ${frame},
  ),
  ${selector}: ($) => choice(${all}, $.${list}),
  ${list}: ($) => prec.right(seq(${aliasedItem}, ${continuation})),
  ${item}: ($) => ${itemBody},
});`;
const after = before
  .replace(`    ${frame},\n`, "")
  .replace(all, `${all.slice(0, -1)}, ${frame})`)
  .replace(continuation, `optional(choice($.${list}, $.frame_phrase))`);
const addRule = (rule) => before.replace("\n});", `\n  ${rule},\n});`);

const directory = mkdtempSync(join(tmpdir(), "abl-selector-frame-suffix-"));
const grammarDirectory = join(directory, "grammar");
const rootPath = join(directory, "grammar.js");
const statementDirectory = join(grammarDirectory, "statements");
const fixture = (description, code = before) => ({
  name: description,
  code,
  cwd: directory,
  filename: join(statementDirectory, "disable.js"),
});
const warning = {
  message:
    /Try moving the optional FRAME phrase in .* onto the ALL arm and the terminal item-list branch\./,
};

try {
  mkdirSync(statementDirectory, { recursive: true });
  writeFileSync(
    rootPath,
    `export default grammar({
      conflicts: ($) => [[$.${item}, $.function_call]],
      precedences: ($) => [[$.frame_phrase, $.other]],
    });`,
  );
  new RuleTester().run(ruleId, selectorFrameSuffix, {
    valid: [
      fixture("FRAME already belongs to the selector arms", after),
      fixture("required FRAME suffix", before.replace(frame, "$.frame_phrase")),
      fixture("suffix after FRAME", before.replace(frame, `${frame}, optional($.other)`)),
      fixture(
        "aliased FRAME suffix",
        before.replace(frame, "optional(alias($.frame_phrase, $.frame))"),
      ),
      fixture("optional selector", before.replace(`$.${selector},`, `optional($.${selector}),`)),
      fixture(
        "aliased owner reference",
        before.replace(ownerUse, `optional(alias($.${owner}, $.body))`),
      ),
      fixture(
        "selector arm order reversed",
        before.replace(`${all}, $.${list}`, `$.${list}, ${all}`),
      ),
      fixture("extra selector arm", before.replace(all, `${all}, $.other`)),
      fixture("required EXCEPT", before.replace("optional($._except_fields)", "$._except_fields")),
      fixture("non-static ALL keyword", before.replace('kw("ALL")', 'kw("ALL", options)')),
      fixture("left associativity", before.replace("prec.right", "prec.left")),
      fixture(
        "precedence with a name",
        before.replace("prec.right(seq(", 'prec.right("items", seq('),
      ),
      fixture(
        "choice other than terminal FRAME",
        before.replace(continuation, `optional(choice($.${list}, $.other))`),
      ),
      fixture("required continuation", before.replace(continuation, `$.${list}`)),
      fixture(
        "unresolved item rule",
        before.replace(aliasedItem, "alias($.__external_item, $.disable_item)"),
      ),
      fixture("nullable item rule", before.replace(itemBody, `optional(${itemBody})`)),
      fixture("hidden item alias", before.replace("$.disable_item)", "$._disable_item)")),
      ...[owner, selector, list].map((name) =>
        fixture(`extra reference to ${name}`, addRule(`other: ($) => $.${name}`)),
      ),
      fixture("computed list reference", `${before}\nconst other = ($) => $["${list}"];`),
      fixture("dynamic reference outside the rule map", `${before}\nconst other = ($) => $[name];`),
      fixture("spread in the rule map", before.replace(`${owner}:`, `...rules,\n  ${owner}:`)),
      fixture("duplicate list rule", addRule(`${list}: ($) => $.other`)),
      ...[`${owner}:`, `${selector}:`, `${list}:`, frame].map((part) =>
        fixture(
          `rule disabled at ${part}`,
          before.replace(part, `\n// oxlint-disable-next-line rule-to-test/${ruleId}\n${part}`),
        ),
      ),
    ],
    invalid: [
      { ...fixture("DISABLE ALL or item list with an optional FRAME suffix"), errors: [warning] },
      {
        ...fixture(
          "the usual no-error terminator",
          before.replace("$._terminator", "$._no_error_terminator"),
        ),
        errors: [warning],
      },
    ],
  });

  for (const [key, name] of [
    ["inline", owner],
    ["conflicts", selector],
    ["precedences", list],
    ["supertypes", owner],
    ["externals", list],
    ["extras", selector],
    ["word", owner],
  ]) {
    const reference = `$.${name}`;
    const nested = ["conflicts", "precedences"].includes(key) ? `[${reference}]` : reference;
    const metadata = key === "word" ? reference : `[${nested}]`;
    writeFileSync(rootPath, `export default grammar({ ${key}: ($) => ${metadata} });`);
    new RuleTester().run(ruleId, selectorFrameSuffix, {
      valid: [fixture(`${name} participates in ${key}`)],
      invalid: [],
    });
  }

  writeFileSync(rootPath, "export default grammar({});");
  const externalModule = join(statementDirectory, "other.js");
  writeFileSync(externalModule, `export default () => ({ other: ($) => $.${list} });`);
  new RuleTester().run(ruleId, selectorFrameSuffix, {
    valid: [fixture("the list is referenced in another module")],
    invalid: [],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
