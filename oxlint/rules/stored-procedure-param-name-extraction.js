import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { report, rule } from "../helpers.js";
import {
  keywordInlineSymbols,
  projectPrecedenceSymbols,
  rootMetadataSymbols,
  staticSourceTokens,
} from "../helpers/project-metadata.js";
import { matchStaticRuleLayout } from "../helpers/static-rule-layout.js";

const ruleId = "stored-procedure-param-name-extraction";
const statementName = "run_stored_procedure_statement";
const bodyName = "__run_stored_procedure_body";
const resultNoErrorName = "__run_stored_procedure_result_no_error";
const resultName = "__run_stored_procedure_result";
const paramsName = "__run_stored_procedure_params";
const prefixName = "__run_stored_procedure_params_prefix";
const tailName = "__run_stored_procedure_param_tail";
const paramName = "__run_stored_procedure_param";
const nameHelper = "__run_stored_procedure_param_name";
const noError = 'alias(kw("NO-ERROR"),$.no_error)';
const measuredRules = new Map([
  [statementName, `seq($._kw_run,$.${bodyName},$._terminator)`],
  [
    bodyName,
    `seq($._kw_stored_procedure,field("procedure",$._identifier_or_string_literal),optional($.${resultNoErrorName}),optional(alias($.${paramsName},$.parameter_list)))`,
  ],
  [resultNoErrorName, `choice(seq($.${resultName},optional(${noError})),${noError})`],
  [
    resultName,
    'choice(seq(kw("LOAD-RESULT-INTO"),field("result_handle",$._qualified_identifier),optional($._status)),seq(field("handle_var",$._qualified_identifier),"=",kw("PROC-HANDLE")))',
  ],
  [paramsName, `seq($.${prefixName},")")`],
  [prefixName, `seq("(",optional(seq($.${paramName},optional($.${tailName}))))`],
  [tailName, `seq(",",$.${paramName},optional($.${tailName}))`],
  [
    paramName,
    'seq(optional(field("direction",choice($._kw_input,$._kw_output,$._kw_input_output))),optional(seq(kw("PARAM"),field("name",$.identifier),"=")),field("value",$._expression))',
  ],
]);
const expectedUses = new Map([
  [statementName, 0],
  [bodyName, 1],
  [resultNoErrorName, 1],
  [resultName, 1],
  [paramsName, 1],
  [prefixName, 1],
  [tailName, 2],
  [paramName, 2],
  [nameHelper, 0],
]);
const sharedInputs = [
  "_kw_run",
  "_kw_stored_procedure",
  "_terminator",
  "_identifier_or_string_literal",
  "_qualified_identifier",
  "_status",
  "no_error",
  "parameter_list",
  "_kw_input",
  "_kw_output",
  "_kw_input_output",
  "identifier",
  "_expression",
  "parenthesized_expression",
  "__input_expression_prefix",
];
const sensitiveRules = [...measuredRules.keys(), nameHelper];
const measuredPrecedence = staticSourceTokens(`
  export default ($) => [
    [$.${paramName}, $.parenthesized_expression],
    [$.${paramName}, $.__input_expression_prefix],
    [$.__run_context_value, $.function_call]
  ]
`).join(" ");

function hasMeasuredPrecedence(file) {
  try {
    const tokens = staticSourceTokens(readFileSync(file, "utf8"));
    if (tokens.at(-1) === ";") tokens.pop();
    return (
      tokens.filter((token, index) => token !== "," || tokens[index + 1] !== "]").join(" ") ===
      measuredPrecedence
    );
  } catch {
    return false;
  }
}

export const storedProcedureParamNameExtraction = rule(
  (context) => ({
    "Program:exit"(program) {
      if (
        resolve(context.cwd, context.filename) !==
        resolve(context.cwd, "grammar/statements/run-stored-procedure.js")
      )
        return;

      const precedenceFile = resolve(context.cwd, "grammar/precedences/run.js");
      if (!hasMeasuredPrecedence(precedenceFile)) return;
      const expectedOutsideFiles = new Map([
        [statementName, [resolve(context.cwd, "grammar/core/statements.js")]],
        [paramName, [precedenceFile]],
      ]);
      const local = matchStaticRuleLayout(
        context,
        program,
        measuredRules,
        expectedUses,
        expectedOutsideFiles,
      );
      if (!local || sharedInputs.some((name) => local.has(name))) return;

      const root = rootMetadataSymbols(context, [
        "conflicts",
        "externals",
        "supertypes",
        "extras",
        "word",
        "precedences",
      ]);
      const inline = keywordInlineSymbols(context);
      const precedence = projectPrecedenceSymbols(context);
      if (
        sensitiveRules.some(
          (name) =>
            root.has(name) || inline.has(name) || (name !== paramName && precedence.has(name)),
        )
      )
        return;

      report(
        context,
        local.get(paramName).value.body.arguments[1],
        ruleId,
        "Try extracting the optional PARAM name = prefix into a private helper. Keep the direction choice, name and value fields, parameter list alias, comma continuation, and precedence in place. Compare parser metrics, parsing speed, and complete valid and recovery trees before retaining the change.",
      );
    },
  }),
  "Suggest extracting the optional stored-procedure parameter name prefix",
);
