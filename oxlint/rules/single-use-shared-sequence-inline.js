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
  sequenceElements,
} from "../helpers.js";

export const singleUseSharedSequenceInline = rule((context) => {
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
        const elements = sequenceElements(property.value.body);
        if (!elements || elements.length < 2 || !isStaticDsl(property.value.body)) continue;
        if (isRuleDisabled(context, property)) continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const use = uses[0];
        const owner = enclosingRule(use);
        if (!owner || owner === property || owner.parent !== property.parent) continue;
        let unsafe = false;
        for (let parent = use.parent; parent !== owner; parent = parent.parent) {
          if (["alias", "token", "token.immediate"].includes(callName(parent))) unsafe = true;
        }
        if (unsafe) continue;
        report(
          context,
          property,
          "single-use-shared-sequence-inline",
          `${name} has one unaliased local sequence use in ${ruleName(owner)}; try adding it to grammar.inline. Check cross-file references and metadata, preserve fields and precedence, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest measuring grammar.inline for shared hidden sequences with one local use");
