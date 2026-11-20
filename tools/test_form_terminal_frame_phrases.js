import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { formTerminalFramePhrases } from "../oxlint/index.js";

const name = "form-terminal-frame-phrases";
const itemAlias = "alias($.__form_item, $.form_item)";
const continuation = "optional($.__form_items)";
const optionalFrames = "repeat($.frame_phrase)";
const requiredFrames = "repeat1($.frame_phrase)";
const itemsWithFrames = "seq($.__form_items, " + optionalFrames + ")";
const body = "choice(" + itemsWithFrames + ", " + requiredFrames + ")";
const itemsRule = "__form_items: ($) => prec.right(seq(" + itemAlias + ", " + continuation + ")),";
const statement = "seq($.__form_prefix, $._terminator)";
const prefix = 'seq(kw("FORM"), $.__form_body)';
const itemField = 'field("field", $._expression)';
const itemRules = [
  'seq(alias($._kw_menu, $.identifier), optional(alias(kw("NO-LABEL"), $.no_label)), optional(alias(kw("NO-LABELS"), $.no_labels)), optional($._format_string))',
  "seq(" +
    itemField +
    ', optional(seq($._kw_colon, field("colon", $._expression))), optional(seq($._kw_label, optional(field("label", $.__form_label)))), optional($.__form_validate_format_view_as_tail))',
  'seq($._kw_skip, optional(field("skip", $._parenthesized_value)))',
  'seq($._kw_space, optional(field("space", $._parenthesized_value)))',
].join(", ");
const itemRule = "__form_item: ($) => prec.right(choice(" + itemRules + ")),";
const before = [
  "export default ({ kw }) => ({",
  "  form_statement: ($) => " + statement + ",",
  "  __form_prefix: ($) => " + prefix + ",",
  "  __form_body: ($) => " + body + ",",
  "  " + itemsRule,
  "  " + itemRule,
  "});",
].join("\n");
const after = before
  .replace(
    body,
    "choice(prec.right(seq(" + itemAlias + ", optional($.__form_body))), " + requiredFrames + ")",
  )
  .replace("  " + itemsRule + "\n", "");
const message = /nonempty frame phrase sequence.*terminal alternative.*right-recursive FORM body/;
const appendRule = (entry) => before.replace("\n});", "\n  " + entry + ",\n});");
const suppress = (part, rule = "rule-to-test/" + name) =>
  before.replace(part, "\n  // oxlint-disable-next-line " + rule + "\n  " + part);
const directory = mkdtempSync(join(tmpdir(), "abl-form-terminal-frame-phrases-"));
const fixture = (label, code = before) => ({
  name: label,
  code,
  cwd: directory,
  filename: join(directory, "grammar", "statements", "form.js"),
});

try {
  mkdirSync(join(directory, "grammar", "statements"), { recursive: true });
  mkdirSync(join(directory, "grammar", "precedences"));
  writeFileSync(
    join(directory, "grammar", "precedences", "form.js"),
    "export default ($) => [[$.__form_item, $._widgets]];",
  );
  new RuleTester().run(name, formTerminalFramePhrases, {
    valid: [
      fixture("measured terminal alternative", after),
      fixture("different statement terminator", before.replace(statement, "seq($.__form_prefix)")),
      fixture("different prefix", before.replace(prefix, 'seq(kw("MESSAGE"), $.__form_body)')),
      fixture(
        "frames first",
        before.replace(body, "choice(" + requiredFrames + ", " + itemsWithFrames + ")"),
      ),
      fixture("missing frames-only arm", before.replace(body, itemsWithFrames)),
      fixture("required mixed-body frames", before.replace(optionalFrames, requiredFrames)),
      fixture("nullable frames-only arm", before.replace(requiredFrames, optionalFrames)),
      fixture("item alias removed", before.replace(itemAlias, "$.__form_item")),
      fixture("item alias changed", before.replace(itemAlias, "alias($.__form_item, $.other)")),
      fixture("different item field", before.replace(itemField, 'field("value", $._expression)')),
      fixture("required continuation", before.replace(continuation, "$.__form_items")),
      fixture("different continuation", before.replace(continuation, "optional($.__form_body)")),
      fixture(
        "different list precedence",
        before.replace(itemsRule, itemsRule.replace("prec.right", "prec.left")),
      ),
      fixture(
        "different item precedence",
        before.replace(itemRule, itemRule.replace("prec.right", "prec.left")),
      ),
      fixture("shared item list", before.replaceAll("__form_items", "_form_items")),
      fixture("extra body use", appendRule("other: ($) => $.__form_body")),
      fixture(
        "extra aliased item-list use",
        appendRule("other: ($) => alias($.__form_items, $.items)"),
      ),
      fixture("computed reference", before.replace("$.__form_items", '$["__form_items"]')),
      fixture("computed body key", before.replace("__form_body:", '["__form_body"]:')),
      fixture("spread in rule map", before.replace("=> ({", "=> ({ ...otherRules,")),
      fixture("duplicate body", appendRule("__form_body: ($) => $.other")),
      fixture("local frame phrase", appendRule("frame_phrase: ($) => $.other")),
      fixture("local item alias target", appendRule("form_item: ($) => $.other")),
      fixture("missing item definition", before.replace(itemRule, "")),
      fixture("same-file metadata", before + "\nexport const inline = ($) => [$.__form_items];"),
      fixture("suppressed frame repetition", suppress(optionalFrames)),
      fixture("suppressed item list", suppress(itemsRule)),
    ],
    invalid: [
      { ...fixture("measured original layout"), errors: [{ message }] },
      {
        ...fixture("unrelated suppression", suppress(optionalFrames, "rule-to-test/recurse")),
        errors: [{ message }],
      },
    ],
  });

  const blockedSources = [
    [
      "root grammar metadata",
      join(directory, "grammar.js"),
      "export default grammar({inline: ($) => [$.__form_items]});",
    ],
    [
      "external body precedence",
      join(directory, "grammar", "precedences", "other.js"),
      "export default ($) => [[$.__form_body, $.other]];",
    ],
    [
      "external computed private reference",
      join(directory, "grammar", "statements", "other.js"),
      'export default () => ({ other: ($) => $["__form_items"] });',
    ],
    [
      "external property collision",
      join(directory, "grammar", "statements", "other.js"),
      "export default () => ({ __form_body: ($) => $.other });",
    ],
  ];
  for (const [label, filename, source] of blockedSources) {
    writeFileSync(filename, source);
    new RuleTester().run(name + " " + label, formTerminalFramePhrases, {
      valid: [fixture(label)],
      invalid: [],
    });
    rmSync(filename);
  }
} finally {
  rmSync(directory, { recursive: true, force: true });
}
