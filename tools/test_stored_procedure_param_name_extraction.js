import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { storedProcedureParamNameExtraction } from "../oxlint/index.js";

const ruleId = "stored-procedure-param-name-extraction";
const parameter = "__run_stored_procedure_param";
const helper = "__run_stored_procedure_param_name";
const namePrefix = 'seq(kw("PARAM"), field("name", $.identifier), "=")';
const direction =
  'optional(field("direction", choice($._kw_input, $._kw_output, $._kw_input_output)))';
const before = `export default ({ kw }) => ({
  run_stored_procedure_statement: ($) =>
    seq($._kw_run, $.__run_stored_procedure_body, $._terminator),
  __run_stored_procedure_body: ($) =>
    seq(
      $._kw_stored_procedure,
      field("procedure", $._identifier_or_string_literal),
      optional($.__run_stored_procedure_result_no_error),
      optional(alias($.__run_stored_procedure_params, $.parameter_list)),
    ),
  __run_stored_procedure_result_no_error: ($) =>
    choice(
      seq($.__run_stored_procedure_result, optional(alias(kw("NO-ERROR"), $.no_error))),
      alias(kw("NO-ERROR"), $.no_error),
    ),
  __run_stored_procedure_result: ($) =>
    choice(
      seq(kw("LOAD-RESULT-INTO"), field("result_handle", $._qualified_identifier), optional($._status)),
      seq(field("handle_var", $._qualified_identifier), "=", kw("PROC-HANDLE")),
    ),
  __run_stored_procedure_params: ($) => seq($.__run_stored_procedure_params_prefix, ")"),
  __run_stored_procedure_params_prefix: ($) =>
    seq("(", optional(seq($.${parameter}, optional($.__run_stored_procedure_param_tail)))),
  __run_stored_procedure_param_tail: ($) =>
    seq(",", $.${parameter}, optional($.__run_stored_procedure_param_tail)),
  ${parameter}: ($) =>
    seq(
      ${direction},
      optional(${namePrefix}),
      field("value", $._expression),
    ),
});`;
const append = (source, entry) => source.replace("\n});", "\n  " + entry + ",\n});");
const after = append(before.replace(namePrefix, "$." + helper), `${helper}: ($) => ${namePrefix}`);
const measuredPrecedence = `export default ($) => [
  [$.${parameter}, $.parenthesized_expression],
  [$.${parameter}, $.__input_expression_prefix],
  [$.__run_context_value, $.function_call],
];`;
const suppress = (rule) =>
  before.replace(
    "optional(" + namePrefix + ")",
    "// oxlint-disable-next-line " + rule + "\n      optional(" + namePrefix + ")",
  );
const message = /extracting the optional PARAM name = prefix into a private helper/;

const directory = mkdtempSync(join(tmpdir(), "abl-stored-procedure-param-name-"));
const grammarPath = join(directory, "grammar.js");
const coreStatementsPath = join(directory, "grammar", "core", "statements.js");
const precedencePath = join(directory, "grammar", "precedences", "run.js");
const otherPath = join(directory, "grammar", "statements", "other.js");
const fixture = (name, code = before, filename = "run-stored-procedure.js") => ({
  name,
  code,
  cwd: directory,
  filename: join(directory, "grammar", "statements", filename),
});
const test = (label, valid, invalid = []) =>
  new RuleTester().run(label, storedProcedureParamNameExtraction, { valid, invalid });

try {
  mkdirSync(join(directory, "grammar", "statements"), { recursive: true });
  mkdirSync(join(directory, "grammar", "core"));
  mkdirSync(join(directory, "grammar", "precedences"));
  writeFileSync(
    coreStatementsPath,
    "export default () => ({ _statement: ($) => choice($.run_stored_procedure_statement, $.other) });",
  );
  writeFileSync(precedencePath, measuredPrecedence);
  test(
    ruleId,
    [
      fixture("exact measured extraction", after),
      fixture("different grammar module", before, "other.js"),
      fixture(
        "different named keyword options",
        before.replace('kw("PARAM")', 'kw("PARAM", { offset: 3 })'),
      ),
      fixture("different name field", before.replace('field("name"', 'field("parameter"')),
      fixture("different name operand", before.replace("$.identifier", "$._qualified_identifier")),
      fixture(
        "different name delimiter",
        before.replace(namePrefix, namePrefix.replace('"="', '":="')),
      ),
      fixture("required named prefix", before.replace(`optional(${namePrefix})`, namePrefix)),
      fixture(
        "different direction choice",
        before.replace(direction, direction.replace("$._kw_input, ", "")),
      ),
      fixture("different value field", before.replace('field("value"', 'field("operand"')),
      fixture("different parameter list alias", before.replace("$.parameter_list", "$.arguments")),
      fixture("different list delimiters", before.replace('seq("(",', 'seq("[",')),
      fixture(
        "different recursive continuation",
        before.replace(
          `seq(",", $.${parameter}, optional($.__run_stored_procedure_param_tail))`,
          `seq(",", $.${parameter})`,
        ),
      ),
      fixture("precedence wrapper added", before.replace(namePrefix, `prec.right(${namePrefix})`)),
      fixture("local name helper", append(before, `${helper}: ($) => $.other`)),
      fixture(
        "local parameter alias use",
        append(before, `other: ($) => alias($.${parameter}, $.other)`),
      ),
      fixture("local alias collision", append(before, "parameter_list: ($) => $.other")),
      fixture("local shared value collision", append(before, "_expression: ($) => $.other")),
      fixture("computed rule map entry", append(before, '["other"]: ($) => $.other')),
      fixture("dynamic rule map entry", append(before, "...otherRules")),
      fixture("suppressed name prefix", suppress("rule-to-test/" + ruleId)),
    ],
    [
      { ...fixture("measured original"), errors: [{ message }] },
      {
        ...fixture("unrelated suppression", suppress("rule-to-test/shared-choice")),
        errors: [{ message }],
      },
    ],
  );

  const collisions = [
    [
      "external helper collision",
      otherPath,
      `export default ({ kw }) => ({ ${helper}: ($) => $.other });`,
    ],
    [
      "external computed parameter use",
      otherPath,
      `export default ({ kw }) => ({ other: ($) => $["${parameter}"] });`,
    ],
    [
      "external statement use",
      otherPath,
      "export default () => ({ other: ($) => $.run_stored_procedure_statement });",
    ],
    [
      "root statement conflict",
      grammarPath,
      "export default grammar({ conflicts: ($) => [[$.run_stored_procedure_statement, $.other]] });",
    ],
    [
      "computed root statement metadata",
      grammarPath,
      'export default grammar({ inline: ($) => [$["run_stored_procedure_statement"]] });',
    ],
    [
      "computed statement precedence metadata",
      join(directory, "grammar", "precedences", "other.js"),
      'export default ($) => [[$["run_stored_procedure_statement"], $.other]];',
    ],
    [
      "root inline metadata",
      grammarPath,
      `export default grammar({ inline: ($) => [$.${parameter}] });`,
    ],
    [
      "additional precedence file",
      join(directory, "grammar", "precedences", "other.js"),
      `export default ($) => [[$.${parameter}, $.other]];`,
    ],
  ];
  for (const [name, file, source] of collisions) {
    writeFileSync(file, source);
    test(ruleId + " " + name, [fixture(name)]);
    rmSync(file);
  }

  const changedPrecedences = [
    ["missing measured precedence file", null],
    [
      "different INPUT precedence",
      measuredPrecedence.replace("$.__input_expression_prefix", "$.other"),
    ],
    [
      "computed precedence reference",
      measuredPrecedence.replace("$." + parameter, `$["${parameter}"]`),
    ],
    [
      "additional precedence entry",
      measuredPrecedence.replace("];", `  [$.${parameter}, $.other],\n];`),
    ],
  ];
  for (const [name, source] of changedPrecedences) {
    if (source === null) rmSync(precedencePath);
    else writeFileSync(precedencePath, source);
    test(ruleId + " " + name, [fixture(name)]);
  }
} finally {
  rmSync(directory, { recursive: true, force: true });
}
