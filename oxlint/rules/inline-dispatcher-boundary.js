import {
  callName,
  isRuleDisabled,
  isRuleProperty,
  memberName,
  report,
  rule,
  ruleName,
  unwrap,
} from "../helpers.js";
import { rootInlineSymbols } from "../helpers/project-metadata.js";

export const inlineDispatcherBoundary = rule((context) => {
  const inlined = rootInlineSymbols(context);
  const properties = [];
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
      if (ruleName(node) === "inline" && node.value?.body?.type === "ArrayExpression") {
        for (const element of node.value.body.elements) {
          const name = memberName(element);
          if (name) inlined.add(name);
        }
      }
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property);
        const body = property.value.body;
        if (!name.startsWith("_") || !inlined.has(name) || isRuleDisabled(context, property))
          continue;
        if (callName(body) !== "choice" || body.arguments.length < 8) continue;
        const symbolBranch = (branch) => {
          const value = unwrap(branch);
          return (
            memberName(value) !== null ||
            (callName(value) === "alias" && memberName(value.arguments[0]) !== null)
          );
        };
        if (!body.arguments.every(symbolBranch)) continue;
        report(
          context,
          property,
          "inline-dispatcher-boundary",
          `${name} expands a broad symbol choice through grammar.inline; try removing its inline entry to retain a hidden dispatcher boundary. Preserve the body, precedence, fields and aliases, then measure parser size and validate trees before keeping the change.`,
        );
      }
    },
  };
}, "Suggest measuring a hidden boundary for broad explicitly inlined symbol choices");
