import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  isStaticKeywordCall,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const sharedKeywordFieldInline = rule((context) => {
  const properties = [],
    restricted = new Set();
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      const name = memberName(node);
      if (!name) return;
      if (
        !enclosingRule(node) ||
        ["alias", "token", "token.immediate"].includes(callName(node.parent))
      )
        restricted.add(name);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (!name.startsWith("_") || name.startsWith("__") || restricted.has(name)) continue;
        if (callName(body) !== "seq" || body.arguments.length !== 2) continue;
        const [keyword, value] = body.arguments;
        if (
          !isStaticKeywordCall(keyword) ||
          callName(value) !== "field" ||
          value.arguments.length !== 2 ||
          value.arguments[0].type !== "Literal" ||
          typeof value.arguments[0].value !== "string" ||
          !memberName(value.arguments[1]) ||
          memberName(value.arguments[1]) === name ||
          isRuleDisabled(context, property)
        )
          continue;
        report(
          context,
          property,
          "shared-keyword-field-inline",
          `${name} is a shared keyword-plus-field helper; try adding it to grammar.inline. Check cross-file aliases and metadata, preserve keyword options and field scope, then measure parser size and compare complete CSTs including anonymous children.`,
        );
      }
    },
  };
}, "Suggest metadata inlining of shared keyword-led valued helpers");
