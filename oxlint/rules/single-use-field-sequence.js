import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  isSmallSequenceElement,
  isStaticDsl,
  isStaticKeywordCall,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const singleUseFieldSequence = rule((context) => {
  const properties = [];
  const references = new Map();
  const smallElement = (node) =>
    isSmallSequenceElement(node) ||
    isStaticKeywordCall(node) ||
    (["token", "token.immediate"].includes(callName(node)) &&
      node.arguments.length === 1 &&
      node.arguments[0].type === "Literal" &&
      isStaticDsl(node));
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
        if (!name.startsWith("__") || name.endsWith("_body") || isRuleDisabled(context, property))
          continue;
        if (
          callName(body) !== "seq" ||
          body.arguments.length < 2 ||
          body.arguments.length > 4 ||
          !body.arguments.every(smallElement) ||
          !isStaticDsl(body)
        )
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const use = uses[0],
          owner = enclosingRule(use),
          field = use.parent;
        if (
          memberName(use) !== name ||
          !owner ||
          owner === property ||
          owner.parent !== property.parent ||
          callName(field) !== "field" ||
          field.arguments.length !== 2 ||
          field.arguments[1] !== use ||
          field.arguments[0].type !== "Literal" ||
          typeof field.arguments[0].value !== "string"
        )
          continue;
        if (isRuleDisabled(context, owner) || isRuleDisabled(context, use)) continue;
        let unsafe = false;
        for (let parent = field.parent; parent !== owner; parent = parent.parent) {
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
            unsafe = true;
        }
        if (unsafe) continue;
        report(
          context,
          property,
          "single-use-field-sequence",
          `${name} has one local use inside the ${field.arguments[0].value} field; try inlining its complete sequence inside that same field. Preserve inner fields, lexical tokens, aliases and optionality, check external references and metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest inlining small private sequences at a single field-wrapped use");
