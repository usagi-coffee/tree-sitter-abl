import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { inputOutputTerminalOptions } from "../oxlint/index.js";

const name = "input-output-terminal-options";
const argumentChoice =
  "choice($.string_literal, $.number_literal, $.identifier, $.preprocessor_name, $._value_expression)";
const argumentsUse = "optional($.__input_output_arguments)";
const optionsUse = "optional($.__input_output_options)";
const through = "seq($._kw_through, $._program_target, " + argumentsUse + ", " + optionsUse + ")";
const close = "alias($._kw_close, $.close)";
const optionList = "prec.right(seq($.__input_output_option, " + optionsUse + "))";
const echo = 'alias(kw("ECHO"), $.echo)';
const argumentRule =
  "__input_output_arguments: ($) => prec.right(seq(" + argumentChoice + ", " + argumentsUse + ")),";
const throughTail = "__input_output_through_tail";
const rules = [
  "input_output_statement: ($) => seq($.__input_output_prefix, $.__input_output_body, $._terminator),",
  "__input_output_prefix: ($) => seq($._kw_input_output, optional($._stream_phrase)),",
  "__input_output_body: ($) => choice(" + close + ", " + through + "),",
  argumentRule,
  "__input_output_options: ($) => " + optionList + ",",
  "__input_output_option: ($) => choice(" +
    echo +
    ', alias(kw("NO-ECHO"), $.no_echo), $._map_phrase, alias(kw("UNBUFFERED"), $.unbuffered), alias($._convert_phrase, $.convert_phrase)),',
].join("\n");
const before = "export default ({ kw }) => ({\n" + rules + "\n});";
const after = before
  .replace(through, "seq($._kw_through, $._program_target, optional($." + throughTail + "))")
  .replace(
    argumentRule,
    throughTail +
      ": ($) => choice(prec.right(seq(" +
      argumentChoice +
      ", optional($." +
      throughTail +
      "))), $.__input_output_options),",
  );
const message =
  /existing INPUT-OUTPUT option list.*terminal alternative.*right-recursive THROUGH argument tail/;
const appendRule = (entry) => before.replace("\n});", "\n  " + entry + ",\n});");
const suppress = (part, rule = "rule-to-test/" + name) =>
  before.replace(part, "\n  // oxlint-disable-next-line " + rule + "\n  " + part);

const directory = mkdtempSync(join(tmpdir(), "abl-input-output-terminal-options-"));
const fixture = (label, code = before) => ({
  name: label,
  code,
  cwd: directory,
  filename: join(directory, "grammar", "statements", "input-output.js"),
});

try {
  mkdirSync(join(directory, "grammar", "statements"), { recursive: true });
  mkdirSync(join(directory, "grammar", "precedences"));
  new RuleTester().run(name, inputOutputTerminalOptions, {
    valid: [
      fixture("measured terminal alternative", after),
      fixture("different through keyword", before.replace("$._kw_through", "$._kw_from")),
      fixture("different program target", before.replace("$._program_target", "$.identifier")),
      fixture("changed CLOSE alias", before.replace(close, "alias($._kw_close, $.other)")),
      fixture("missing CLOSE alias", before.replace(close, "$._kw_close")),
      fixture("arguments required", before.replace(argumentsUse, "$.__input_output_arguments")),
      fixture("options required", before.replace(optionsUse, "$.__input_output_options")),
      fixture(
        "different argument and option order",
        before.replace(
          through,
          "seq($._kw_through, $._program_target, " + optionsUse + ", " + argumentsUse + ")",
        ),
      ),
      fixture("different argument choice", before.replace("$.number_literal", "$.int64")),
      fixture("argument recursion loses precedence", before.replace("prec.right", "prec.left")),
      fixture(
        "different precedence on option recursion",
        before.replace(optionList, optionList.replace("prec.right", "prec.left")),
      ),
      fixture("nullable option list", before.replace(optionList, "optional(" + optionList + ")")),
      fixture("different option alias", before.replace(echo, 'alias(kw("ECHO"), $.other)')),
      fixture(
        "different option keyword",
        before.replace(echo, 'alias(kw("ECHO", { offset: 3 }), $.echo)'),
      ),
      fixture(
        "shared argument helper",
        before.replaceAll("__input_output_arguments", "_input_output_arguments"),
      ),
      fixture("other local argument use", appendRule("other: ($) => $.__input_output_arguments")),
      fixture(
        "other local aliased option use",
        appendRule("other: ($) => alias($.__input_output_options, $.options)"),
      ),
      fixture("computed reference", before.replace("$._program_target", '$["_program_target"]')),
      fixture(
        "computed rule key",
        before.replace("__input_output_body:", '["__input_output_body"]:'),
      ),
      fixture("spread in rule map", before.replace("=> ({", "=> ({ ...otherRules,")),
      fixture("second rule definition", appendRule("__input_output_body: ($) => $.other")),
      fixture("existing terminal tail", appendRule(throughTail + ": ($) => $.other")),
      fixture(
        "metadata on the same file",
        before + "\nexport const inline = ($) => [$.__input_output_arguments];",
      ),
      fixture("suppressed through arm", suppress(through)),
      fixture("suppressed argument helper", suppress(argumentRule)),
      fixture("suppressed option alias", suppress(echo)),
    ],
    invalid: [
      { ...fixture("measured two optional tails"), errors: [{ message }] },
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
      "export default grammar({inline: ($) => [$.__input_output_arguments]});",
    ],
    [
      "external precedence",
      join(directory, "grammar", "precedences", "input-output.js"),
      "export default ($) => [[$.__input_output_options, $.other]];",
    ],
    [
      "external private reference",
      join(directory, "grammar", "statements", "other.js"),
      'export default () => ({ other: ($) => $["__input_output_options"] });',
    ],
    [
      "external terminal tail definition",
      join(directory, "grammar", "statements", "other.js"),
      "export default () => ({ " + throughTail + ": ($) => $.other });",
    ],
  ];
  for (const [label, filename, source] of blockedSources) {
    writeFileSync(filename, source);
    new RuleTester().run(name + " " + label, inputOutputTerminalOptions, {
      valid: [fixture(label)],
      invalid: [],
    });
    rmSync(filename);
  }
} finally {
  rmSync(directory, { recursive: true, force: true });
}
