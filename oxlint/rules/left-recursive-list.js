import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  isStaticDsl,
  memberName,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const leftRecursiveList = rule((context) => {
  const properties = [],
    metadata = new Set();
  const item = (node) => {
    if (memberName(node)) return true;
    if (callName(node) === "field")
      return (
        node.arguments.length === 2 &&
        node.arguments[0].type === "Literal" &&
        typeof node.arguments[0].value === "string" &&
        item(node.arguments[1])
      );
    if (callName(node) === "alias")
      return (
        node.arguments.length === 2 &&
        memberName(node.arguments[0]) &&
        memberName(node.arguments[1])
      );
    return false;
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
      if (name && !enclosingRule(node)) metadata.add(name);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (
          !name.startsWith("_") ||
          metadata.has(name) ||
          isRuleDisabled(context, property) ||
          isRuleDisabled(context, body)
        )
          continue;
        if (callName(body) !== "seq" || body.arguments.length !== 2 || !isStaticDsl(body)) continue;
        const head = body.arguments[0],
          repeat = body.arguments[1];
        if (
          !item(head) ||
          referencedSymbols(head).includes(name) ||
          callName(repeat) !== "repeat" ||
          repeat.arguments.length !== 1 ||
          isRuleDisabled(context, repeat)
        )
          continue;
        const tail = repeat.arguments[0];
        if (
          callName(tail) !== "seq" ||
          tail.arguments.length !== 2 ||
          tail.arguments[0].type !== "Literal" ||
          tail.arguments[0].value !== "," ||
          !item(tail.arguments[1]) ||
          signature(head) !== signature(tail.arguments[1]) ||
          isRuleDisabled(context, tail)
        )
          continue;
        report(
          context,
          property,
          "left-recursive-list",
          `${name} uses an item followed by repeated comma/item pairs; try a hidden left-recursive sequence with optional previous-list-plus-comma followed by the same item. Preserve the one-item minimum, fields, aliases and order, check metadata and attachment behavior, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest explicit left recursion for non-empty hidden comma-separated repetitions");
