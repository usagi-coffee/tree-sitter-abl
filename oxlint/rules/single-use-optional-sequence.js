import {
  callName,
  enclosingRule,
  isNullable,
  isRuleDisabled,
  isRuleProperty,
  isSmallSequenceElement,
  isStaticDsl,
  isStaticKeywordCall,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const singleUseOptionalSequence = rule((context) => {
  const properties = [];
  const references = new Map();
  const smallElement = (node) => isSmallSequenceElement(node) || isStaticKeywordCall(node);
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      const name =
        memberName(node) ??
        (node.computed &&
        node.object.type === "Identifier" &&
        node.object.name === "$" &&
        node.property.type === "Literal" &&
        typeof node.property.value === "string"
          ? node.property.value
          : null);
      if (!name) return;
      if (!references.has(name)) references.set(name, []);
      references.get(name).push(node);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property);
        const body = property.value.body;
        if (!name.startsWith("__") || name.endsWith("_body")) continue;
        if (isRuleDisabled(context, property) || !isStaticDsl(body)) continue;
        if (callName(body) !== "seq" || body.arguments.length < 2 || body.arguments.length > 3)
          continue;
        const prefix = body.arguments.slice(0, -1);
        if (!prefix.every(smallElement) || prefix.every((element) => isNullable(element))) continue;
        const optionalTail = body.arguments.at(-1);
        if (callName(optionalTail) !== "optional" || optionalTail.arguments.length !== 1) continue;
        const tail = optionalTail.arguments[0];
        if (callName(tail) !== "seq" || tail.arguments.length < 2 || tail.arguments.length > 4)
          continue;
        if (!tail.arguments.every(smallElement)) continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const use = uses[0];
        const owner = enclosingRule(use);
        if (
          memberName(use) !== name ||
          !owner ||
          owner === property ||
          owner.parent !== property.parent
        )
          continue;
        let unsafe = false;
        for (let parent = use.parent; parent !== owner; parent = parent.parent) {
          if (
            ["alias", "field", "token", "token.immediate", "prec.dynamic"].includes(
              callName(parent),
            )
          )
            unsafe = true;
        }
        if (unsafe) continue;
        report(
          context,
          property,
          "single-use-optional-sequence",
          `${name} has one unaliased local use in ${ruleName(owner)}; try inlining this small sequence with its optional compound suffix intact. Preserve fields and precedence, check external references and grammar metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest inlining single-use private sequences ending in a small optional sequence");
