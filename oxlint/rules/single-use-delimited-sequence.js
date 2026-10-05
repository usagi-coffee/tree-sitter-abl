import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  isSmallSequenceElement,
  isStaticDsl,
  memberName,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const singleUseDelimitedSequence = rule((context) => {
  const properties = [];
  const references = new Map();
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
        if (callName(body) !== "seq" || body.arguments.length < 4 || body.arguments.length > 7)
          continue;
        const opener = body.arguments[0];
        const closer = body.arguments.at(-1);
        if (opener.type !== "Literal" || closer.type !== "Literal") continue;
        const pairs = { "(": ")", "[": "]", "{": "}" };
        if (!Object.hasOwn(pairs, opener.value) || pairs[opener.value] !== closer.value) continue;
        const content = body.arguments.slice(1, -1);
        if (
          !content.every(isSmallSequenceElement) ||
          content.flatMap(referencedSymbols).length === 0
        )
          continue;
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
        if (isRuleDisabled(context, owner) || isRuleDisabled(context, use)) continue;
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
          "single-use-delimited-sequence",
          `${name} has one unaliased local use in ${ruleName(owner)}; try inlining this delimited sequence with both delimiters and its complete contents intact. Preserve fields, optionality, order and precedence, check external references and grammar metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest inlining single-use private delimited argument sequences");
