import {
  callName,
  enclosingRule,
  isNullable,
  isRuleDisabled,
  isRuleProperty,
  memberName,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const optionalTailChoiceCollapse = rule((context) => {
  const properties = [],
    references = new Map();
  const safe = (node) => {
    if (memberName(node)) return true;
    if (node?.type === "Literal") return typeof node.value === "string" && node.value.length > 0;
    const name = callName(node);
    if (name === "field")
      return (
        node.arguments.length === 2 &&
        node.arguments[0].type === "Literal" &&
        typeof node.arguments[0].value === "string" &&
        safe(node.arguments[1])
      );
    if (name === "alias")
      return (
        node.arguments.length === 2 &&
        memberName(node.arguments[0]) &&
        memberName(node.arguments[1])
      );
    return (
      ["seq", "choice", "optional"].includes(name) &&
      node.arguments.length > 0 &&
      node.arguments.every(safe)
    );
  };
  const signature = (node) =>
    JSON.stringify(context.sourceCode.getTokens(node).map(({ type, value }) => [type, value]));
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
      const uses = references.get(name) ?? [];
      uses.push(node);
      references.set(name, uses);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (
          !name.startsWith("__") ||
          isRuleDisabled(context, property) ||
          callName(body) !== "choice" ||
          body.arguments.length !== 2 ||
          !safe(body)
        )
          continue;
        const [branch, tail] = body.arguments;
        if (callName(branch) !== "seq" || branch.arguments.length !== 2) continue;
        const [head, remainder] = branch.arguments;
        if (
          isNullable(head) ||
          isNullable(tail) ||
          callName(remainder) !== "optional" ||
          remainder.arguments.length !== 1 ||
          signature(remainder.arguments[0]) !== signature(tail) ||
          referencedSymbols(body).includes(name)
        )
          continue;
        if ([body, branch, head, remainder, tail].some((part) => isRuleDisabled(context, part)))
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const use = uses[0],
          optional = use.parent,
          owner = enclosingRule(use);
        if (
          use.computed ||
          !owner ||
          owner === property ||
          owner.parent !== property.parent ||
          callName(optional) !== "optional" ||
          optional.arguments.length !== 1 ||
          callName(optional.parent) !== "seq" ||
          isRuleDisabled(context, owner) ||
          isRuleDisabled(context, optional)
        )
          continue;
        let unsafe = false;
        for (let parent = optional.parent; parent !== owner; parent = parent.parent) {
          if (
            [
              "alias",
              "field",
              "token",
              "token.immediate",
              "prec",
              "prec.left",
              "prec.right",
              "prec.dynamic",
            ].includes(callName(parent))
          )
            unsafe = true;
        }
        if (unsafe) continue;
        report(
          context,
          property,
          "optional-tail-choice-collapse",
          `${name} enumerates a head with optional tail, or the same tail alone, and its only local use is optional; try replacing that use with ordered optional head and optional tail. Preserve fields, aliases and both-present order, check cross-file references and metadata, then measure parser bytes and counts and validate trees.`,
        );
      }
    },
  };
}, "Suggest collapsing an optional non-empty tail choice into two ordered optional elements");
