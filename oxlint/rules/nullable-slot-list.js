import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  isStaticDsl,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const nullableSlotList = rule((context) => {
  const properties = [],
    references = new Map();
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
        node.property.type === "Literal"
          ? node.property.value
          : null);
      if (typeof name !== "string") return;
      if (!references.has(name)) references.set(name, []);
      references.get(name).push(node);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (!name.startsWith("_") || name.endsWith("_body") || isRuleDisabled(context, property))
          continue;
        if (callName(body) !== "choice" || body.arguments.length !== 2 || !isStaticDsl(body))
          continue;
        const [nonempty, emptyFirst] = body.arguments;
        if (
          callName(nonempty) !== "seq" ||
          nonempty.arguments.length !== 2 ||
          !memberName(nonempty.arguments[0])
        )
          continue;
        const repeat = nonempty.arguments[1];
        if (
          callName(repeat) !== "repeat" ||
          repeat.arguments.length !== 1 ||
          callName(emptyFirst) !== "repeat1" ||
          emptyFirst.arguments.length !== 1
        )
          continue;
        const slot = repeat.arguments[0];
        if (
          signature(slot) !== signature(emptyFirst.arguments[0]) ||
          callName(slot) !== "seq" ||
          slot.arguments.length !== 2
        )
          continue;
        const [separator, item] = slot.arguments;
        if (
          separator.type !== "Literal" ||
          separator.value !== "," ||
          callName(item) !== "optional" ||
          item.arguments.length !== 1 ||
          signature(item.arguments[0]) !== signature(nonempty.arguments[0])
        )
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1 || memberName(uses[0]) !== name) continue;
        const use = uses[0],
          owner = enclosingRule(use),
          optional = use.parent;
        if (
          !owner ||
          owner === property ||
          owner.parent !== property.parent ||
          isRuleDisabled(context, owner)
        )
          continue;
        if (
          callName(optional) !== "optional" ||
          optional.arguments.length !== 1 ||
          callName(optional.parent) !== "seq"
        )
          continue;
        if (isRuleDisabled(context, optional)) continue;
        let unsafe = false;
        for (let parent = optional.parent; parent !== owner; parent = parent.parent) {
          if (
            [
              "field",
              "alias",
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
          "nullable-slot-list",
          `${name} distinguishes present and omitted first items but is itself optional; try expanding the call site into an optional first item followed by the existing repeated comma-and-optional-item slot. Preserve omitted and trailing slots, item trees and separator tokens, check external references and metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest simplifying optional lists that explicitly support omitted positional items");
