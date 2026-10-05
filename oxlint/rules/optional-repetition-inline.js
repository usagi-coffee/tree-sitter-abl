import {
  callName,
  complexity,
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

export const optionalRepetitionInline = rule((context) => {
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
        if (
          callName(body) !== "repeat1" ||
          body.arguments.length !== 1 ||
          complexity(body) < 6 ||
          referencedSymbols(body).length === 0
        )
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length < 2 || uses.length > 4) continue;
        const safe = uses.every((use) => {
          const owner = enclosingRule(use),
            optional = use.parent;
          if (
            memberName(use) !== name ||
            !owner ||
            owner === property ||
            owner.parent !== property.parent
          )
            return false;
          if (callName(optional) !== "optional" || optional.arguments.length !== 1) return false;
          if (isRuleDisabled(context, owner) || isRuleDisabled(context, optional)) return false;
          for (let parent = optional.parent; parent !== owner; parent = parent.parent) {
            if (
              ["field", "alias", "token", "token.immediate", "prec.dynamic"].includes(
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
          "optional-repetition-inline",
          `${name} is a non-empty repetition used only inside ${uses.length} local optional calls; try inlining the repetition at those calls while retaining each optional wrapper. Preserve item order, fields, aliases and precedence, check external references and metadata, then measure parser bytes and counts and validate trees.`,
        );
      }
    },
  };
}, "Suggest inlining reused private repetition wrappers whose callers are all optional");
