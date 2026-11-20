import {
  dslSignature,
  isRuleDisabled,
  isRuleProperty,
  isStaticDsl,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { usedOutsideFile } from "../helpers/project-metadata.js";

const ruleId = "input-output-terminal-options";
const bodyName = "__input_output_body";
const tailName = "__input_output_through_tail";
const argumentChoice =
  "choice($.string_literal,$.number_literal,$.identifier,$.preprocessor_name,$._value_expression)";
const through =
  "seq($._kw_through,$._program_target,optional($.__input_output_arguments),optional($.__input_output_options))";
const optionChoice = [
  'alias(kw("ECHO"),$.echo)',
  'alias(kw("NO-ECHO"),$.no_echo)',
  "$._map_phrase",
  'alias(kw("UNBUFFERED"),$.unbuffered)',
  "alias($._convert_phrase,$.convert_phrase)",
].join(",");
const measuredRules = new Map([
  ["input_output_statement", "seq($.__input_output_prefix,$.__input_output_body,$._terminator)"],
  ["__input_output_prefix", "seq($._kw_input_output,optional($._stream_phrase))"],
  [bodyName, "choice(alias($._kw_close,$.close)," + through + ")"],
  [
    "__input_output_arguments",
    "prec.right(seq(" + argumentChoice + ",optional($.__input_output_arguments)))",
  ],
  [
    "__input_output_options",
    "prec.right(seq($.__input_output_option,optional($.__input_output_options)))",
  ],
  ["__input_output_option", "choice(" + optionChoice + ")"],
]);
const expectedUses = new Map([
  ["__input_output_prefix", 1],
  [bodyName, 1],
  ["__input_output_arguments", 2],
  ["__input_output_options", 2],
  ["__input_output_option", 1],
  [tailName, 0],
]);

export const inputOutputTerminalOptions = rule((context) => {
  const suppressed = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" && node.arguments.some(suppressed));

  return {
    "Program:exit"(program) {
      const [declaration] = program.body;
      const factory = declaration?.declaration;
      if (
        program.body.length !== 1 ||
        declaration.type !== "ExportDefaultDeclaration" ||
        factory?.type !== "ArrowFunctionExpression" ||
        factory.async ||
        factory.params.length !== 1 ||
        factory.params[0].type !== "ObjectPattern" ||
        factory.body.type !== "ObjectExpression"
      )
        return;

      const bindings = factory.params[0].properties;
      if (bindings.length !== 1 || !bindings[0].shorthand || bindings[0].value.name !== "kw")
        return;

      const properties = factory.body.properties;
      if (!properties.some((entry) => ruleName(entry) === bodyName)) return;
      if (
        properties.some(
          (entry) =>
            !isRuleProperty(entry) ||
            entry.computed ||
            entry.value.async ||
            entry.value.params.length !== 1 ||
            !isStaticDsl(entry.value.body),
        )
      )
        return;

      const local = new Map(properties.map((entry) => [ruleName(entry), entry]));
      if (local.size !== properties.length || local.has(tailName)) return;

      for (const [name, signature] of measuredRules) {
        const entry = local.get(name);
        if (
          !entry ||
          dslSignature(entry.value.body) !== signature ||
          suppressed(entry) ||
          suppressed(entry.value.body)
        )
          return;
      }

      const counts = new Map();
      for (const entry of properties) {
        for (const name of referencedSymbols(entry.value.body)) {
          if (expectedUses.has(name)) counts.set(name, (counts.get(name) ?? 0) + 1);
        }
      }

      for (const [name, expected] of expectedUses) {
        if (
          (counts.get(name) ?? 0) !== expected ||
          usedOutsideFile(context, name, { wholeName: true })
        )
          return;
      }

      report(
        context,
        local.get(bodyName).value.body.arguments[1],
        ruleId,
        "Try making the existing INPUT-OUTPUT option list the terminal alternative of the right-recursive THROUGH argument tail. Keep the tail optional, preserve the CLOSE alias and program target, and retain the option aliases, order and both right-precedence wrappers. Compare parser metrics, parsing speed, and complete valid and recovery trees before retaining the change.",
      );
    },
  };
}, "Suggest making INPUT-OUTPUT options the terminal alternative of the THROUGH argument tail");
