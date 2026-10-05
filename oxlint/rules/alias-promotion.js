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
  unwrap,
} from "../helpers.js";

export const aliasPromotion = rule((context) => {
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
        if (!name.startsWith("__") || isRuleDisabled(context, property)) continue;
        if (!["seq", "choice"].includes(callName(unwrap(body))) || !isStaticDsl(body)) continue;
        const uses = references.get(name) ?? [];
        if (uses.length === 0) continue;
        let target = null;
        const safe = uses.every((use) => {
          const owner = enclosingRule(use);
          const alias = use.parent;
          if (!owner || owner === property || owner.parent !== property.parent) return false;
          if (memberName(use) !== name || callName(alias) !== "alias") return false;
          if (alias.arguments.length !== 2 || alias.arguments[0] !== use) return false;
          const destination = memberName(alias.arguments[1]);
          if (!destination || destination.startsWith("_")) return false;
          if (target !== null && target !== destination) return false;
          target = destination;
          for (let parent = alias.parent; parent !== owner; parent = parent.parent) {
            if (["alias", "token", "token.immediate"].includes(callName(parent))) return false;
          }
          return true;
        });
        if (!safe || properties.some((other) => ruleName(other) === target)) continue;
        if (
          (references.get(target) ?? []).some(
            (use) => callName(use.parent) !== "alias" || use.parent.arguments[1] !== use,
          )
        )
          continue;
        report(
          context,
          property,
          "alias-promotion",
          `${name} is used locally only as the named alias ${target}; try defining ${target} directly and replacing those alias calls with $.${target}. Check external references and rule-name collisions first, preserve the body and precedence, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest promoting private nonterminal rules used exclusively through one named alias");
