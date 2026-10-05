import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const sharedClosingDelimiterInline = rule((context) => {
  const properties = [],
    metadata = new Set();
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      const name = memberName(node);
      if (name && !enclosingRule(node)) metadata.add(name);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (!name.startsWith("_") || name.startsWith("__") || metadata.has(name)) continue;
        if (callName(body) !== "seq" || body.arguments.length !== 2) continue;
        const [prefix, close] = body.arguments,
          prefixName = memberName(prefix);
        if (
          !prefixName?.startsWith("_") ||
          !prefixName.endsWith("_prefix") ||
          prefixName === name ||
          close.type !== "Literal" ||
          ![")", "]", "}", ">"].includes(close.value) ||
          isRuleDisabled(context, property)
        )
          continue;
        report(
          context,
          property,
          "shared-closing-delimiter-inline",
          `${name} appends ${JSON.stringify(close.value)} to hidden prefix ${prefixName}; try adding this shared wrapper to grammar.inline. Check cross-file uses and metadata, preserve caller fields, aliases and delimiter tokens, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest metadata inlining of shared wrappers that close a hidden prefix");
