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

export const recursiveBodyReuse = rule((context) => {
  const properties = [];
  const candidates = [];
  const staticPrecedence = ["prec", "prec.left", "prec.right"];
  const signature = (node) =>
    JSON.stringify(context.sourceCode.getTokens(node).map(({ type, value }) => [type, value]));
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    CallExpression(node) {
      if (!["seq", ...staticPrecedence].includes(callName(node))) return;
      const owner = enclosingRule(node);
      if (!owner || owner.value.body === node || !isStaticDsl(node)) return;
      if (staticPrecedence.includes(callName(node.parent))) return;
      for (let parent = node.parent; parent !== owner; parent = parent.parent) {
        if (["alias", "token", "token.immediate", "prec.dynamic"].includes(callName(parent)))
          return;
      }
      if (isRuleDisabled(context, node)) return;
      candidates.push({ node, owner, signature: signature(node) });
    },
    "Program:exit"() {
      const helpers = [];
      for (const property of properties) {
        const name = ruleName(property);
        if (!name.startsWith("_") || isRuleDisabled(context, property)) continue;
        let body = property.value.body;
        if (!isStaticDsl(body)) continue;
        while (staticPrecedence.includes(callName(body))) body = body.arguments.at(-1);
        if (callName(body) !== "seq" || body.arguments.length < 2) continue;
        const last = body.arguments.at(-1);
        if (
          callName(last) !== "optional" ||
          last.arguments.length !== 1 ||
          memberName(last.arguments[0]) !== name
        )
          continue;
        const prefix = body.arguments.slice(0, -1);
        if (prefix.every((element) => isNullable(element))) continue;
        if (prefix.some((element) => referencedSymbols(element).includes(name))) continue;
        helpers.push({ property, name, signature: signature(property.value.body) });
      }
      for (const candidate of candidates) {
        const helper = helpers.find(
          (helper) =>
            helper.property !== candidate.owner &&
            helper.property.parent === candidate.owner.parent &&
            helper.signature === candidate.signature,
        );
        if (!helper) continue;
        report(
          context,
          candidate.node,
          "recursive-body-reuse",
          `This expression repeats the complete recursive body of ${helper.name}; try replacing it with $.${helper.name}. Preserve fields, aliases and precedence, check helper-specific conflicts, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest reusing hidden recursive helpers where their complete body is expanded inside another rule");
