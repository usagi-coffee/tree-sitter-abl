import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { radioSetKeywordPrefix } from "../oxlint/index.js";

const ruleId = "radio-set-keyword-prefix";
const keyword = "$._kw_radio_set";
const prefixName = "__radio_set_orientation_size_prefix";
const oldPrefix = "optional($." + prefixName + ")";
const prefixBody = "choice(seq($.__radio_set_orientation, optional($.size_phrase)), $.size_phrase)";
const buttons = 'field("buttons", $._list_item_pairs)';
const tail = "optional($.__radio_set_size_tooltip_tail)";
const before = `export default ({ kw }) => ({
  radio_set_phrase: ($) =>
    seq(${keyword}, ${oldPrefix}, kw("RADIO-BUTTONS"), ${buttons}, ${tail}),
  ${prefixName}: ($) => ${prefixBody},
  __radio_set_size_tooltip_tail: ($) =>
    choice(seq($.size_phrase, optional($._tooltip_phrase)), $._tooltip_phrase),
  __radio_set_orientation: ($) =>
    choice(seq($._kw_horizontal, optional(kw("EXPAND"))), $._kw_vertical),
});`;
const after = before
  .replace(keyword + ", " + oldPrefix, "$." + prefixName)
  .replace(prefixBody, "seq(" + keyword + ", optional(" + prefixBody + "))");
const message = /required RADIO-SET keyword.*existing orientation and size prefix/;
const appendRule = (entry) => before.replace("\n});", "\n  " + entry + ",\n});");
const suppressPrefix = (ruleName = "rule-to-test/" + ruleId) =>
  before.replace(
    prefixName + ":",
    "// oxlint-disable-next-line " + ruleName + "\n  " + prefixName + ":",
  );
const directory = mkdtempSync(join(tmpdir(), "abl-radio-set-keyword-prefix-"));
const fixture = (name, code = before) => ({
  name,
  code,
  cwd: directory,
  filename: join(directory, "grammar", "phrases", "radio-set.js"),
});

try {
  mkdirSync(join(directory, "grammar", "phrases"), { recursive: true });
  mkdirSync(join(directory, "grammar", "precedences"));
  writeFileSync(
    join(directory, "grammar", "phrases", "format.js"),
    "export default () => ({format: ($) => seq($.__radio_set_orientation, alias($.other, $.radio_set_phrase))});",
  );
  writeFileSync(
    join(directory, "grammar", "phrases", "view-as.js"),
    "export default () => ({view: ($) => choice($.radio_set_phrase, $.__radio_set_size_tooltip_tail)});",
  );
  new RuleTester().run(ruleId, radioSetKeywordPrefix, {
    valid: [
      fixture("measured folded prefix", after),
      fixture("optional keyword", before.replace(keyword, "optional(" + keyword + ")")),
      fixture(
        "different keyword alias",
        before.replace(keyword, "alias(" + keyword + ", $.widget)"),
      ),
      fixture("prefix already required", before.replace(oldPrefix, "$." + prefixName)),
      fixture(
        "size before orientation",
        before.replace(
          prefixBody,
          "choice(seq($.size_phrase, optional($.__radio_set_orientation)), $.__radio_set_orientation)",
        ),
      ),
      fixture(
        "different prefix precedence",
        before.replace(prefixBody, "prec.right(" + prefixBody + ")"),
      ),
      fixture(
        "reordered orientation",
        before.replace(
          '$._kw_horizontal, optional(kw("EXPAND"))',
          'optional(kw("EXPAND")), $._kw_horizontal',
        ),
      ),
      fixture(
        "different buttons keyword",
        before.replace('kw("RADIO-BUTTONS")', "$._kw_radio_buttons"),
      ),
      fixture(
        "different buttons keyword alias",
        before.replace('kw("RADIO-BUTTONS")', 'alias(kw("RADIO-BUTTONS"), $.buttons)'),
      ),
      fixture(
        "different buttons field",
        before.replace(buttons, 'field("items", $._list_item_pairs)'),
      ),
      fixture(
        "different buttons field rule",
        before.replace(buttons, 'field("buttons", $._list_item_values)'),
      ),
      fixture("required trailing options", before.replace(tail, "$.__radio_set_size_tooltip_tail")),
      fixture(
        "different trailing option order",
        before.replace(
          "seq($.size_phrase, optional($._tooltip_phrase))",
          "seq($._tooltip_phrase, optional($.size_phrase))",
        ),
      ),
      fixture(
        "additional aliased prefix use",
        appendRule("other: ($) => alias($." + prefixName + ", $.other)"),
      ),
      fixture(
        "computed prefix reference",
        before.replace(oldPrefix, 'optional($["' + prefixName + '"])'),
      ),
      fixture("computed prefix key", before.replace(prefixName + ":", '["' + prefixName + '"]:')),
      fixture("duplicate prefix key", appendRule(prefixName + ": ($) => $.other")),
      fixture("spread rule map", before.replace("=> ({", "=> ({ ...otherRules,")),
      fixture("local shared keyword replacement", appendRule('_kw_radio_set: ($) => kw("OTHER")')),
      fixture("local size replacement", appendRule("size_phrase: ($) => $.other")),
      fixture(
        "same-file metadata",
        before + "\nexport const inline = ($) => [$." + prefixName + "];",
      ),
      fixture("prefix suppression", suppressPrefix()),
    ],
    invalid: [
      { ...fixture("measured original with unchanged shared users"), errors: [{ message }] },
      {
        ...fixture(
          "unrelated suppression",
          suppressPrefix("rule-to-test/optional-tail-choice-collapse"),
        ),
        errors: [{ message }],
      },
    ],
  });

  const blockedSources = [
    [
      "root inline metadata for the prefix",
      join(directory, "grammar.js"),
      "export default grammar({inline: ($) => [$." + prefixName + "]});",
    ],
    [
      "root conflict metadata for the public phrase",
      join(directory, "grammar.js"),
      "export default grammar({conflicts: ($) => [[$.radio_set_phrase, $.other]]});",
    ],
    [
      "external computed prefix reference",
      join(directory, "grammar", "phrases", "other.js"),
      'export default () => ({ other: ($) => $["' + prefixName + '"] });',
    ],
    [
      "precedence metadata for the public phrase",
      join(directory, "grammar", "precedences", "other.js"),
      "export default ($) => [[$.radio_set_phrase, $.other]];",
    ],
  ];
  for (const [label, filename, source] of blockedSources) {
    writeFileSync(filename, source);
    new RuleTester().run(ruleId + " " + label, radioSetKeywordPrefix, {
      valid: [fixture(label)],
      invalid: [],
    });
    rmSync(filename);
  }
} finally {
  rmSync(directory, { recursive: true, force: true });
}
