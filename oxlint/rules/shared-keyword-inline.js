import {
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  isStaticKeywordCall,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const sharedKeywordInline = rule((context) => {
  const properties = [];
  const references = new Map();
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      const name = memberName(node);
      if (!name) return;
      const uses = references.get(name) ?? [];
      uses.push(node);
      references.set(name, uses);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property);
        if (!name.startsWith("_") || name.startsWith("__")) continue;
        if (!isStaticKeywordCall(property.value.body)) continue;
        if (isRuleDisabled(context, property)) continue;
        const uses = references.get(name) ?? [];
        if (!uses.some((use) => enclosingRule(use)?.parent === property.parent)) continue;
        if (uses.some((use) => !enclosingRule(use))) continue;
        report(
          context,
          property,
          "shared-keyword-inline",
          `${name} wraps one static keyword; try adding it to grammar.inline. Check cross-file uses, aliases, and grammar metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest measuring grammar.inline for shared static keyword wrappers");
