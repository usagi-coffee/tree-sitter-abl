import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const fieldForwardingRule = rule((context) => {
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
        if (!name.startsWith("__") || name.endsWith("_body")) continue;
        if (isRuleDisabled(context, property)) continue;
        let body = property.value.body;
        if (callName(body) === "seq" && body.arguments.length === 1) body = body.arguments[0];
        if (callName(body) !== "field" || body.arguments.length !== 2) continue;
        const label = body.arguments[0];
        const target = memberName(body.arguments[1]);
        if (label.type !== "Literal" || typeof label.value !== "string") continue;
        if (!target || target === name || target.endsWith("_keyword")) continue;
        const uses = references.get(name) ?? [];
        if (uses.length === 0) continue;
        const safe = uses.every((use) => {
          const owner = enclosingRule(use);
          if (
            memberName(use) !== name ||
            !owner ||
            owner === property ||
            owner.parent !== property.parent
          )
            return false;
          for (let parent = use.parent; parent !== owner; parent = parent.parent) {
            if (
              ["alias", "field", "token", "token.immediate", "prec.dynamic"].includes(
                callName(parent),
              )
            )
              return false;
          }
          return true;
        });
        if (!safe) continue;
        report(
          context,
          property,
          "field-forwarding-rule",
          `${name} only applies field ${JSON.stringify(label.value)} to ${target}; try replacing its local uses with the exact field wrapper and removing the private helper. Check external references and grammar metadata, preserve field scope and precedence, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest inlining private helpers that only apply a field to a symbol");
