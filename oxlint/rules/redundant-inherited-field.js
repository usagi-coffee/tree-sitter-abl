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

export const redundantInheritedField = rule((context) => {
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
          body = property.value.body;
        if (
          !name.startsWith("__") ||
          callName(body) !== "seq" ||
          !isStaticDsl(body) ||
          isRuleDisabled(context, property)
        )
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length === 0) continue;
        for (const inner of body.arguments) {
          if (
            callName(inner) !== "field" ||
            inner.arguments.length !== 2 ||
            inner.arguments[0].type !== "Literal" ||
            typeof inner.arguments[0].value !== "string" ||
            !memberName(inner.arguments[1]) ||
            isRuleDisabled(context, inner)
          )
            continue;
          const fieldName = inner.arguments[0].value;
          const safe = uses.every((use) => {
            const owner = enclosingRule(use),
              outer = use.parent;
            if (
              memberName(use) !== name ||
              !owner ||
              owner === property ||
              owner.parent !== property.parent ||
              callName(outer) !== "field" ||
              outer.arguments.length !== 2 ||
              outer.arguments[1] !== use ||
              outer.arguments[0].type !== "Literal" ||
              outer.arguments[0].value !== fieldName ||
              isRuleDisabled(context, owner) ||
              isRuleDisabled(context, use)
            )
              return false;
            for (let parent = outer.parent; parent !== owner; parent = parent.parent) {
              if (
                parent.type === "CallExpression" &&
                ![
                  "seq",
                  "choice",
                  "optional",
                  "repeat",
                  "repeat1",
                  "prec",
                  "prec.left",
                  "prec.right",
                ].includes(callName(parent))
              )
                return false;
            }
            return true;
          });
          if (!safe) continue;
          report(
            context,
            inner,
            "redundant-inherited-field",
            `Every local use of ${name} already applies the ${fieldName} field; try removing this matching inner field annotation while retaining the helper and caller fields. Check external uses, inherited fields and tree shape, then measure parser field-table size.`,
          );
        }
      }
    },
  };
}, "Suggest removing repeated field annotations inherited from every local caller");
