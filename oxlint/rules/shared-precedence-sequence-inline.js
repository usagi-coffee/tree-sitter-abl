import {
  callName,
  isRuleDisabled,
  isRuleProperty,
  isStaticDsl,
  memberName,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const sharedPrecedenceSequenceInline = rule((context) => {
  const properties = [],
    inlineNames = new Set();
  const wrappers = ["prec", "prec.left", "prec.right"];
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      const name = memberName(node);
      if (!name) return;
      for (let parent = node.parent; parent; parent = parent.parent) {
        if (parent.type === "Property" && ruleName(parent) === "inline") inlineNames.add(name);
      }
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property);
        let body = property.value.body;
        if (!name.startsWith("_") || name.startsWith("__") || inlineNames.has(name)) continue;
        if (!wrappers.includes(callName(body)) || isRuleDisabled(context, property)) continue;
        while (wrappers.includes(callName(body))) {
          if (!body.arguments.slice(0, -1).every((part) => part.type === "Literal")) break;
          body = body.arguments.at(-1);
        }
        if (
          callName(body) !== "seq" ||
          body.arguments.length < 2 ||
          !isStaticDsl(body) ||
          referencedSymbols(body).includes(name)
        )
          continue;
        report(
          context,
          property,
          "shared-precedence-sequence-inline",
          `${name} wraps a nonrecursive sequence in static precedence; try adding it to grammar.inline. Check cross-file uses and metadata, retain every precedence wrapper, field and alias, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest measuring metadata inlining of shared sequences with static precedence");
