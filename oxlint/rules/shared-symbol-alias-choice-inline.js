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

export const sharedSymbolAliasChoiceInline = rule((context) => {
  const properties = [],
    restricted = rootInlineSymbols(context);
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      const name = memberName(node);
      if (!name) return;
      const owner = enclosingRule(node);
      if (!owner) {
        restricted.add(name);
        return;
      }
      for (let parent = node.parent; parent !== owner; parent = parent.parent) {
        if (["alias", "token", "token.immediate"].includes(callName(parent))) {
          restricted.add(name);
          break;
        }
      }
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (
          !name.startsWith("_") ||
          name.startsWith("__") ||
          restricted.has(name) ||
          isRuleDisabled(context, property) ||
          callName(body) !== "choice" ||
          body.arguments.length < 2 ||
          body.arguments.length > 6
        )
          continue;
        let direct = false,
          aliased = false;
        const matches = body.arguments.every((alternative) => {
          const symbol = memberName(alternative);
          if (symbol) {
            direct = true;
            return symbol !== name;
          }
          if (callName(alternative) !== "alias" || alternative.arguments.length !== 2) return false;
          const source = memberName(alternative.arguments[0]),
            target = memberName(alternative.arguments[1]);
          aliased = true;
          return source && source !== name && target && !target.startsWith("_");
        });
        if (!matches || !direct || !aliased) continue;
        report(
          context,
          property,
          "shared-symbol-alias-choice-inline",
          `${name} mixes direct symbols and named symbol aliases in a small shared choice; try adding it to grammar.inline. Check cross-file uses and conflict/precedence metadata, preserve every alternative, alias and field scope, then measure parser bytes and counts and validate trees.`,
        );
      }
    },
  };
}, "Suggest metadata inlining of small shared choices mixing symbols and named symbol aliases");
