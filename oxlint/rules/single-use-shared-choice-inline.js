import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  isStaticDsl,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const singleUseSharedChoiceInline = rule((context) => {
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
        const body = property.value.body;
        if (!name.startsWith("_") || name.startsWith("__")) continue;
        if (callName(body) !== "choice" || body.arguments.length < 2 || !isStaticDsl(body))
          continue;
        if (isRuleDisabled(context, property)) continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const owner = enclosingRule(uses[0]);
        if (!owner || owner === property || owner.parent !== property.parent) continue;
        let unsafe = false;
        for (let parent = uses[0].parent; parent !== owner; parent = parent.parent) {
          if (["alias", "token", "token.immediate"].includes(callName(parent))) unsafe = true;
        }
        if (unsafe) continue;
        report(
          context,
          property,
          "single-use-shared-choice-inline",
          `${name} has one unaliased local use in ${ruleName(owner)}; try adding it to grammar.inline. Check references in other files and grammar metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest measuring grammar.inline for shared hidden choices with one local use");
