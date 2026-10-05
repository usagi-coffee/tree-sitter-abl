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

export const singleUseFieldChoice = rule((context) => {
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
        if (!name.startsWith("_") || name.endsWith("_body")) continue;
        if (isRuleDisabled(context, property) || !isStaticDsl(body)) continue;
        if (callName(body) !== "choice" || body.arguments.length < 2 || body.arguments.length > 5)
          continue;
        if (
          !body.arguments.every(
            (argument) => memberName(argument) && !memberName(argument).endsWith("_keyword"),
          )
        )
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const use = uses[0];
        const owner = enclosingRule(use);
        if (
          memberName(use) !== name ||
          !owner ||
          owner === property ||
          owner.parent !== property.parent
        )
          continue;
        if (isRuleDisabled(context, owner) || isRuleDisabled(context, use)) continue;
        const field = use.parent;
        if (
          callName(field) !== "field" ||
          field.arguments.length !== 2 ||
          field.arguments[1] !== use ||
          field.arguments[0].type !== "Literal" ||
          typeof field.arguments[0].value !== "string"
        )
          continue;
        let unsafe = false;
        for (let parent = field.parent; parent !== owner; parent = parent.parent) {
          if (["alias", "token", "token.immediate", "prec.dynamic"].includes(callName(parent)))
            unsafe = true;
        }
        if (unsafe) continue;
        report(
          context,
          property,
          "single-use-field-choice",
          `${name} has one local use inside the ${field.arguments[0].value} field; try inlining its symbol choice inside that field. Preserve alternative order, the complete field scope and call-site precedence, check external references and metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest inlining single-use hidden symbol choices inside their existing field");
