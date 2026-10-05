import {
  callName,
  enclosingRule,
  isNullable,
  isRuleDisabled,
  isRuleProperty,
  isStaticDsl,
  memberName,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const choiceSuffixHoist = rule((context) => {
  const properties = [];
  const references = new Map();
  const nullable = (node) => {
    const name = callName(node);
    if (name === "field") return nullable(node.arguments[1]);
    if (name === "alias") return nullable(node.arguments[0]);
    if (name === "seq") return node.arguments.every(nullable);
    if (name === "choice") return node.arguments.some(nullable);
    return isNullable(node);
  };
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
        node.property.type === "Literal"
          ? node.property.value
          : null);
      if (typeof name !== "string") return;
      if (!references.has(name)) references.set(name, []);
      references.get(name).push(node);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property);
        const body = property.value.body;
        if (!name.startsWith("__") || isRuleDisabled(context, property)) continue;
        if (callName(body) !== "seq" || body.arguments.length !== 2 || !isStaticDsl(body)) continue;
        const [head, tail] = body.arguments;
        if (callName(head) !== "choice" || head.arguments.length < 2 || nullable(head)) continue;
        if (
          callName(tail) !== "optional" ||
          tail.arguments.length !== 1 ||
          !memberName(tail.arguments[0])
        )
          continue;
        if (referencedSymbols(body).includes(name)) continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1 || memberName(uses[0]) !== name) continue;
        const use = uses[0];
        const owner = enclosingRule(use);
        if (
          !owner ||
          owner === property ||
          owner.parent !== property.parent ||
          isRuleDisabled(context, owner)
        )
          continue;
        if (callName(use.parent) !== "seq" || isRuleDisabled(context, use.parent)) continue;
        let unsafe = false;
        for (let parent = use.parent; parent !== owner; parent = parent.parent) {
          if (parent.type === "CallExpression" && !["seq", "choice"].includes(callName(parent)))
            unsafe = true;
        }
        if (unsafe) continue;
        report(
          context,
          property,
          "choice-suffix-hoist",
          `${name} contains a choice followed by an optional suffix and has one direct sequence use; try moving the complete optional suffix immediately after that use. Preserve choice order, fields, aliases and precedence, check external references and metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest moving optional suffixes out of single-use hidden choice bodies");
