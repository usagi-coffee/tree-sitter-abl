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

export const recursiveItemInline = rule((context) => {
  const properties = [],
    references = new Map();
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
        const name = ruleName(property),
          item = property.value.body;
        if (!name.startsWith("_") || name.endsWith("_body") || isRuleDisabled(context, property))
          continue;
        if (
          callName(item) !== "seq" ||
          item.arguments.length < 2 ||
          item.arguments.length > 4 ||
          !isStaticDsl(item) ||
          !item.arguments.every(isSmallSequenceElement) ||
          !item.arguments.some((part) => callName(part) === "field")
        )
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const use = uses[0],
          owner = enclosingRule(use);
        if (
          memberName(use) !== name ||
          !owner ||
          owner === property ||
          owner.parent !== property.parent ||
          !ruleName(owner).startsWith("_") ||
          isRuleDisabled(context, owner) ||
          isRuleDisabled(context, use)
        )
          continue;
        const body = owner.value.body;
        if (callName(body) !== "seq" || body.arguments.length !== 2 || body.arguments[0] !== use)
          continue;
        const optional = body.arguments[1];
        if (callName(optional) !== "optional" || optional.arguments.length !== 1) continue;
        const tail = optional.arguments[0];
        if (
          callName(tail) !== "seq" ||
          tail.arguments.length !== 2 ||
          tail.arguments[0].type !== "Literal" ||
          tail.arguments[0].value !== "," ||
          memberName(tail.arguments[1]) !== ruleName(owner)
        )
          continue;
        if (
          isRuleDisabled(context, body) ||
          isRuleDisabled(context, optional) ||
          isRuleDisabled(context, tail)
        )
          continue;
        report(
          context,
          property,
          "recursive-item-inline",
          `${name} is used only as the item of the hidden recursive list ${ruleName(owner)}; try inlining its complete sequence at that item, keeping the comma continuation unchanged. Check external uses and metadata, preserve fields and tree shape, then measure parser size and counts.`,
        );
      }
    },
  };
}, "Suggest inlining single-use structured items into hidden comma-recursive lists");
