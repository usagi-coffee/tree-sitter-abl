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

export const forwardingRule = rule((context) => {
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
        const target = memberName(property.value.body);
        if (!name.startsWith("__") || !target || target === name) continue;
        const uses = references.get(name) ?? [];
        if (isRuleDisabled(context, property)) continue;
        const safeUses = uses.every((use) => {
          const owner = enclosingRule(use);
          if (!owner || owner === property || owner.parent !== property.parent) return false;
          for (let parent = use.parent; parent !== owner; parent = parent.parent) {
            if (["token", "token.immediate"].includes(callName(parent))) return false;
            if (
              callName(parent) === "alias" &&
              (parent.arguments[1] === use || !target.startsWith("_"))
            )
              return false;
          }
          return true;
        });
        if (!safeUses) continue;
        report(
          context,
          property,
          "forwarding-rule",
          `${name} only forwards to ${target}; try replacing its references with the target and removing the private rule. Check external uses, inline/supertype declarations, precedence and conflicts first; measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest measuring removal of private rules that only forward to another symbol");
