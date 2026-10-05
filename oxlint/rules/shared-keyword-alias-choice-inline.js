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

export const sharedKeywordAliasChoiceInline = rule((context) => {
  const properties = [];
  const metadata = new Set();
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      const name = memberName(node);
      if (name && !enclosingRule(node)) metadata.add(name);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property);
        const body = property.value.body;
        if (!name.startsWith("_") || name.startsWith("__") || metadata.has(name)) continue;
        if (callName(body) !== "choice" || body.arguments.length < 2) continue;
        let target = null;
        const matches = body.arguments.every((alternative) => {
          if (callName(alternative) !== "alias" || alternative.arguments.length !== 2) return false;
          if (!isStaticKeywordCall(alternative.arguments[0])) return false;
          const alias = memberName(alternative.arguments[1]);
          if (!alias || alias.startsWith("_") || (target !== null && target !== alias))
            return false;
          target = alias;
          return true;
        });
        if (!matches || isRuleDisabled(context, property)) continue;
        report(
          context,
          property,
          "shared-keyword-alias-choice-inline",
          `${name} chooses static keywords aliased as ${target}; try adding it to grammar.inline. Check cross-file uses and metadata, preserve keyword options and aliases, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest measuring grammar.inline for shared keyword choices with one alias target");
