import {
  callName,
  complexity,
  enclosingRule,
  hasField,
  isKeyword,
  isRuleDisabled,
  isRuleProperty,
  isSmallSequenceElement,
  isStaticDsl,
  memberName,
  report,
  ruleName,
  unwrap,
} from "../helpers.js";

export function singleUsePrecedenceClauseVisitor(context, valueLed = false) {
  const properties = [];
  const references = new Map();
  const staticPrecedence = ["prec", "prec.left", "prec.right"];
  const hasDynamicPrecedence = (node) =>
    callName(node) === "prec.dynamic" ||
    (node?.type === "CallExpression" && node.arguments.some(hasDynamicPrecedence));
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
        if (isRuleDisabled(context, property) || !staticPrecedence.includes(callName(body)))
          continue;
        if (!isStaticDsl(body) || hasDynamicPrecedence(body) || complexity(body) > 24) continue;
        const sequence = unwrap(body);
        if (
          callName(sequence) !== "seq" ||
          sequence.arguments.length < 2 ||
          sequence.arguments.length > 3
        )
          continue;
        if (valueLed) {
          const first = sequence.arguments[0];
          if (
            callName(first) !== "field" ||
            first.arguments.length !== 2 ||
            !memberName(first.arguments[1])
          )
            continue;
        } else if (!isKeyword(sequence.arguments[0]) || !hasField(sequence)) continue;
        if (sequence.arguments.every(isSmallSequenceElement)) continue;
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
          valueLed ? "single-use-precedence-value" : "single-use-precedence-clause",
          `${name} has one unaliased local use in ${ruleName(owner)}; try inlining this small precedence-wrapped ${valueLed ? "field-led item" : "valued clause"}. Retain associativity and fields, preserve the helper's precedence relationships, check external references and grammar metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}
