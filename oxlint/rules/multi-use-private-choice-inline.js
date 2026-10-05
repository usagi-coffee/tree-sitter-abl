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
import { rootInlineSymbols } from "../helpers/project-metadata.js";

export const multiUsePrivateChoiceInline = rule((context) => {
  const inlined = rootInlineSymbols(context);
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
      const uses = references.get(name) ?? [];
      uses.push(node);
      references.set(name, uses);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (!name.startsWith("__") || inlined.has(name) || isRuleDisabled(context, property))
          continue;
        if (callName(body) !== "choice" || body.arguments.length < 2 || body.arguments.length > 5)
          continue;
        if (!body.arguments.every((part) => memberName(part) && memberName(part) !== name))
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length < 2) continue;
        const safeUses = uses.every((use) => {
          const owner = enclosingRule(use);
          if (use.computed || !owner || owner === property || owner.parent !== property.parent)
            return false;
          for (let parent = use.parent; parent !== owner; parent = parent.parent) {
            if (["alias", "token", "token.immediate", "prec.dynamic"].includes(callName(parent)))
              return false;
          }
          return true;
        });
        if (!safeUses) continue;
        report(
          context,
          property,
          "multi-use-private-choice-inline",
          `${name} has ${uses.length} unaliased local uses of a small symbol choice; try adding it to grammar.inline. Check cross-file uses, aliases and existing inline/conflict/precedence metadata first; preserve alternatives and field scopes, then measure parser bytes and counts and validate trees.`,
        );
      }
    },
  };
}, "Suggest metadata inlining of multiply used private choices of grammar symbols");
