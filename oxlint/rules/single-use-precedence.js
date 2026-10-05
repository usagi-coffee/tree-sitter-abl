import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  isSmallSequenceElement,
  isStaticDsl,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const singleUsePrecedence = rule((context) => {
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
        if (!name.startsWith("__") || name.endsWith("_body")) continue;
        let body = property.value.body;
        if (!["prec", "prec.left", "prec.right"].includes(callName(body))) continue;
        if (!isStaticDsl(body) || isRuleDisabled(context, property)) continue;
        while (["prec", "prec.left", "prec.right"].includes(callName(body))) {
          body = body.arguments.at(-1);
        }
        if (callName(body) !== "seq" || body.arguments.length < 2 || body.arguments.length > 3)
          continue;
        if (!body.arguments.every(isSmallSequenceElement)) continue;
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
          "single-use-precedence",
          `${name} has one unaliased local use in ${ruleName(owner)}; try inlining the entire precedence-wrapped sequence, retaining every precedence and associativity wrapper. Check external references and grammar metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest measuring inlining of small single-use private sequences with static precedence wrappers");
