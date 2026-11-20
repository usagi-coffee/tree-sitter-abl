import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { outputTerminalOptions } from "../oxlint/index.js";

const name = "output-terminal-options";
const close = "alias($._kw_close, $.close)";
const to = `seq(
  $._kw_to,
  $.__output_to_target,
  repeat(choice(
    $.preprocessor_name,
    alias($._lob_dir_phrase, $.lob_dir_phrase),
    seq(kw("NUM-COPIES"), field("copies", $.__output_numeric_value)),
    alias($._kw_collate, $.collate),
    alias(kw("LANDSCAPE"), $.landscape),
    alias(kw("PORTRAIT"), $.portrait),
    alias(kw("APPEND"), $.append),
    alias(kw("BINARY"), $.binary),
    alias(kw("KEEP-MESSAGES"), $.keep_messages),
    $.__output_shared_option,
  )),
)`;
const itemsUse = "optional($.__output_program_items)";
const optionsUse = "optional($.__output_shared_options)";
const through = "seq($._kw_through, $._program_target, " + itemsUse + ", " + optionsUse + ")";
const flagAlias = "alias($.__output_program_flag, $.program_flag)";
const items = [
  "$.string_literal",
  "$.number_literal",
  "$.identifier",
  "$.preprocessor_name",
  flagAlias,
  "$._value_expression",
].join(", ");
const itemRule = "prec.right(seq(choice(" + items + "), " + itemsUse + "))";
const echo = 'alias(kw("ECHO"), $.echo)';
const optionList = "prec.right(seq($.__output_shared_option, " + optionsUse + "))";
const flag = "token(/-[A-Za-z][A-Za-z0-9-]*/)";
const tailName = "__output_through_tail";
const before = `export default ({ kw }) => ({
  output_statement: ($) => seq($.__output_prefix, $._terminator),
  __output_prefix: ($) => seq($._kw_output, optional($._stream_phrase), $.__output_body),
  __output_body: ($) => choice(${close}, ${to}, ${through}),
  __output_program_items: ($) => ${itemRule},
  __output_shared_option: ($) => choice(
    ${echo},
    alias(kw("NO-ECHO"), $.no_echo),
    seq($._kw_map, field("map", choice(seq($.identifier, repeat(seq("/", $.identifier))), $.string_literal))),
    alias(kw("NO-MAP"), $.no_map),
    alias(kw("PAGED"), $.paged),
    alias($.__output_page_size_phrase, $.page_size_phrase),
    alias(kw("UNBUFFERED"), $.unbuffered),
    alias($._convert_phrase, $.convert_phrase),
  ),
  __output_shared_options: ($) => ${optionList},
  __output_page_size_phrase: ($) => seq($._kw_page_size, field("page_size", $.__output_numeric_value)),
  __output_numeric_value: ($) => choice($.number_literal, $.preprocessor_name, $._value_expression),
  __output_to_target: ($) => field("file", $.string_literal),
  __output_program_flag: ($) => ${flag},
});`;
const after = before
  .replace(through, "seq($._kw_through, $._program_target, optional($." + tailName + "))")
  .replace(
    "__output_program_items: ($) => " + itemRule,
    tailName +
      ": ($) => choice(prec.right(seq(choice(" +
      items +
      "), optional($." +
      tailName +
      "))), $.__output_shared_options)",
  );
const message = /existing OUTPUT shared option list.*terminal alternative.*right-recursive THROUGH/;
const appendRule = (entry) => before.replace("\n});", "\n  " + entry + ",\n});");
const suppress = (part, rule = "rule-to-test/" + name) =>
  before.replace(part, "\n  // oxlint-disable-next-line " + rule + "\n  " + part);

const directory = mkdtempSync(join(tmpdir(), "abl-output-terminal-options-"));
const fixture = (label, code = before) => ({
  name: label,
  code,
  cwd: directory,
  filename: join(directory, "grammar", "statements", "output.js"),
});

try {
  mkdirSync(join(directory, "grammar", "statements"), { recursive: true });
  mkdirSync(join(directory, "grammar", "precedences"));
  new RuleTester().run(name, outputTerminalOptions, {
    valid: [
      fixture("measured terminal alternative", after),
      fixture("different program target", before.replace("$._program_target", "$.identifier")),
      fixture("missing stream support", before.replace("optional($._stream_phrase), ", "")),
      fixture("different CLOSE alias", before.replace(close, "alias($._kw_close, $.other)")),
      fixture("missing TO branch", before.replace(to + ", ", "")),
      fixture(
        "different use of options in the TO branch",
        before.replace(to, to.replace("$.__output_shared_option", "$.__output_shared_options")),
      ),
      fixture("TO append alias differs", before.replace("$.append", "$.modifier")),
      fixture("program items required", before.replace(itemsUse, "$.__output_program_items")),
      fixture("shared options required", before.replace(optionsUse, "$.__output_shared_options")),
      fixture(
        "options placed before program items",
        before.replace(
          through,
          "seq($._kw_through, $._program_target, " + optionsUse + ", " + itemsUse + ")",
        ),
      ),
      fixture(
        "program items lose precedence",
        before.replace(itemRule, itemRule.replace("prec.right", "prec.left")),
      ),
      fixture("program flag loses alias", before.replace(flagAlias, "$.__output_program_flag")),
      fixture("changed program flag token", before.replace(flag, "token(/-[A-Za-z][A-Za-z0-9]*/)")),
      fixture(
        "option list loses precedence",
        before.replace(optionList, optionList.replace("prec.right", "prec.left")),
      ),
      fixture(
        "option list is nullable",
        before.replace(optionList, "optional(" + optionList + ")"),
      ),
      fixture("changed option alias", before.replace(echo, 'alias(kw("ECHO"), $.other)')),
      fixture("changed map field", before.replace('field("map"', 'field("other"')),
      fixture("other program items use", appendRule("other: ($) => $.__output_program_items")),
      fixture(
        "other local aliased option use",
        appendRule("other: ($) => alias($.__output_shared_options, $.options)"),
      ),
      fixture("other shared option use", appendRule("other: ($) => $.__output_shared_option")),
      fixture("computed reference", before.replace("$._program_target", '$["_program_target"]')),
      fixture("computed rule key", before.replace("__output_body:", '["__output_body"]:')),
      fixture("spread in rule map", before.replace("=> ({", "=> ({ ...otherRules,")),
      fixture("duplicate body rule", appendRule("__output_body: ($) => $.other")),
      fixture("existing terminal tail", appendRule(tailName + ": ($) => $.other")),
      fixture(
        "same-file metadata",
        before + "\nexport const inline = ($) => [$.__output_program_items];",
      ),
      fixture("suppressed THROUGH arm", suppress(through)),
      fixture("suppressed program flag alias", suppress(flagAlias)),
      fixture("suppressed option alias", suppress(echo)),
    ],
    invalid: [
      { ...fixture("measured THROUGH layout"), errors: [{ message }] },
      {
        ...fixture(
          "unrelated suppression",
          suppress(through, "rule-to-test/non-empty-tail-extraction"),
        ),
        errors: [{ message }],
      },
    ],
  });

  const blockedSources = [
    [
      "root inline metadata",
      join(directory, "grammar.js"),
      "export default grammar({inline: ($) => [$.__output_program_items]});",
    ],
    [
      "external precedence",
      join(directory, "grammar", "precedences", "output.js"),
      "export default ($) => [[$.__output_shared_options, $.other]];",
    ],
    [
      "external private reference",
      join(directory, "grammar", "statements", "other.js"),
      'export default () => ({ other: ($) => $["__output_shared_option"] });',
    ],
    [
      "external terminal tail definition",
      join(directory, "grammar", "statements", "other.js"),
      "export default () => ({ " + tailName + ": ($) => $.other });",
    ],
  ];
  for (const [label, filename, source] of blockedSources) {
    writeFileSync(filename, source);
    new RuleTester().run(name + " " + label, outputTerminalOptions, {
      valid: [fixture(label)],
      invalid: [],
    });
    rmSync(filename);
  }
} finally {
  rmSync(directory, { recursive: true, force: true });
}
