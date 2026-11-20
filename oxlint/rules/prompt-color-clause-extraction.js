import {
  callName,
  collectRules,
  isRuleDisabled,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";

const isCall = (node, name, count) => callName(node) === name && node.arguments.length === count;
const optional = (node) => (isCall(node, "optional", 1) ? node.arguments[0] : null);

function fieldValue(node, name) {
  if (!isCall(node, "field", 2)) return null;
  const [label, value] = node.arguments;
  return label.type === "Literal" && label.value === name ? memberName(value) : null;
}

function isColorValue(body) {
  const values = ["_kw_normal", "_kw_input", "_kw_messages", "color_phrase"];
  return (
    isCall(body, "choice", values.length) &&
    body.arguments.every((value, index) => memberName(value) === values[index])
  );
}

export const promptColorClauseExtraction = rule(
  collectRules((context, properties) => {
    const suppressed = (node) =>
      isRuleDisabled(context, node) ||
      (node.type === "CallExpression" && node.arguments.some(suppressed));

    for (const owner of properties) {
      const name = ruleName(owner);
      const body = owner.value.body;
      if (
        !name.startsWith("__") ||
        callName(body) !== "choice" ||
        isRuleDisabled(context, owner) ||
        isRuleDisabled(context, body)
      )
        continue;

      for (const option of body.arguments) {
        if (!isCall(option, "seq", 4)) continue;
        const [color, marker, primary, prompt] = option.arguments;
        const value = fieldValue(primary, "color");
        const clause = optional(prompt);
        if (
          memberName(color) !== "_kw_color" ||
          memberName(optional(marker)) !== "_kw_display" ||
          !value?.startsWith("__") ||
          !isCall(clause, "seq", 2) ||
          memberName(clause.arguments[0]) !== "_kw_prompt" ||
          fieldValue(clause.arguments[1], "prompt_color") !== value ||
          suppressed(option)
        )
          continue;

        const map = owner.parent.properties;
        if (map.some((entry) => entry.type === "SpreadElement" || entry.computed)) continue;
        const definitions = map.filter((entry) => ruleName(entry) === value);
        if (
          map.filter((entry) => ruleName(entry) === name).length !== 1 ||
          definitions.length !== 1 ||
          !properties.includes(definitions[0]) ||
          !isColorValue(definitions[0].value.body)
        )
          continue;

        report(
          context,
          prompt,
          "prompt-color-clause-extraction",
          "Try extracting the PROMPT keyword and its color field into a private rule. Keep the clause optional and preserve the primary color and its DISPLAY marker, then compare parser metrics, speed, and complete valid and recovery trees.",
        );
      }
    }
  }),
  "Suggest extracting the optional PROMPT color clause from a COLOR option",
);
