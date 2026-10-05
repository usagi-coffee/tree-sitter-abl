import {
  callName,
  isRuleDisabled,
  isRuleProperty,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const shortPrivatePrefix = rule((context) => {
  const properties = [],
    aliasTargets = new Set();
  const match = context.filename.replaceAll("\\", "/").match(/\/grammar\/statements\/([^/]+)\.js$/);
  if (!match) return {};
  const stem = match[1].replaceAll("-", "_");
  const oldName = `__${stem}_statement_prefix`,
    shorter = `__${stem}_prefix`;
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    CallExpression(node) {
      if (callName(node) === "alias" && node.arguments.length === 2) {
        const target = memberName(node.arguments[1]);
        if (target) aliasTargets.add(target);
      }
    },
    "Program:exit"() {
      for (const property of properties) {
        if (
          ruleName(property) !== oldName ||
          callName(property.value.body) !== "seq" ||
          isRuleDisabled(context, property)
        )
          continue;
        if (aliasTargets.has(oldName) || properties.some((other) => ruleName(other) === shorter))
          continue;
        if (
          !properties.some(
            (other) => other.parent === property.parent && ruleName(other) === `${stem}_statement`,
          )
        )
          continue;
        report(
          context,
          property,
          "short-private-prefix",
          `${oldName} repeats the statement role already established by its owning file; consider ${shorter}. Check all references, metadata and name collisions before renaming, preserve exposed node names, and measure generated parser bytes. This shortens emitted symbol names without claiming a parser-count or runtime improvement.`,
        );
      }
    },
  };
}, "Suggest shorter descriptive private statement-prefix names to reduce generated C symbol text");
