import {
  callName,
  enclosingRule,
  isRuleProperty,
  isSmallSequenceElement,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const singleUseSequence = rule((context) => {
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
        if (!name.startsWith("__") || name.endsWith("_body")) continue;
        if (callName(body) !== "seq" || body.arguments.length < 2 || body.arguments.length > 3)
          continue;
        if (!body.arguments.every(isSmallSequenceElement)) continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const use = uses[0];
        const owner = enclosingRule(use);
        if (!owner || owner === property || owner.parent !== property.parent) continue;
        if (["alias", "field"].includes(callName(use.parent))) continue;
        let lexical = false;
        for (
          let ancestor = use.parent;
          ancestor && ancestor !== owner;
          ancestor = ancestor.parent
        ) {
          if (["token", "token.immediate"].includes(callName(ancestor))) lexical = true;
        }
        if (lexical) continue;
        report(
          context,
          property,
          "single-use-sequence",
          `${name} has one unaliased local use in ${ruleName(owner)}; try inlining this small sequence. Check external references, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest measuring inlining of small, locally single-use private sequences");
