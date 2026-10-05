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

export const closingDelimiterWrapper = rule((context) => {
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
        if (callName(body) !== "seq" || body.arguments.length !== 2) continue;
        const prefixName = memberName(body.arguments[0]);
        const closer = body.arguments[1];
        if (!prefixName?.startsWith("__") || closer.type !== "Literal") continue;
        const pairs = { ")": "(", "]": "[", "}": "{" };
        if (!Object.hasOwn(pairs, closer.value)) continue;
        const prefix = properties.find(
          (candidate) => ruleName(candidate) === prefixName && candidate.parent === property.parent,
        );
        if (!prefix || prefix === property || callName(prefix.value.body) !== "seq") continue;
        const opener = prefix.value.body.arguments[0];
        if (opener?.type !== "Literal" || opener.value !== pairs[closer.value]) continue;
        const uses = references.get(name) ?? [];
        if (uses.length < 2 || uses.length > 4) continue;
        const safe = uses.every((use) => {
          const owner = enclosingRule(use);
          if (
            memberName(use) !== name ||
            !owner ||
            owner === property ||
            owner === prefix ||
            owner.parent !== property.parent
          )
            return false;
          if (isRuleDisabled(context, owner) || isRuleDisabled(context, use)) return false;
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
          "closing-delimiter-wrapper",
          `${name} only appends a closing delimiter to ${prefixName} at ${uses.length} local unaliased uses; try inlining that wrapper while keeping the opening-prefix helper intact. Preserve delimiter tokens, fields and call-site precedence, check external references and metadata, then measure parser bytes and counts and validate trees.`,
        );
      }
    },
  };
}, "Suggest inlining small reused closing-delimiter wrappers while retaining their prefix helper");
