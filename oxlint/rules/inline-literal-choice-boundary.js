import {
  callName,
  isRuleDisabled,
  isRuleProperty,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { rootInlineSymbols } from "../helpers/project-metadata.js";

export const inlineLiteralChoiceBoundary = rule((context) => {
  const inlined = rootInlineSymbols(context);
  const properties = [];
  const literalSymbol = (node) => {
    const name = memberName(node);
    return name !== null && !name.startsWith("_") && name.endsWith("_literal");
  };
  const literalAlias = (node) =>
    callName(node) === "alias" &&
    node.arguments.length === 2 &&
    memberName(node.arguments[0])?.startsWith("_") &&
    literalSymbol(node.arguments[1]);
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
        const name = ruleName(property),
          body = property.value.body;
        if (!name.startsWith("_") || !inlined.has(name) || isRuleDisabled(context, property))
          continue;
        if (
          callName(body) !== "choice" ||
          body.arguments.length < 3 ||
          body.arguments.length > 7 ||
          isRuleDisabled(context, body)
        )
          continue;
        if (body.arguments.filter(literalSymbol).length < 2) continue;
        if (!body.arguments.some(literalAlias)) continue;
        if (!body.arguments.every((branch) => literalSymbol(branch) || literalAlias(branch)))
          continue;
        report(
          context,
          property,
          "inline-literal-choice-boundary",
          `${name} expands a literal-node choice with named nonterminal aliases through grammar.inline; try removing its inline entry to retain a hidden scalar boundary. Preserve literal aliases, branch order and caller fields, then compare action savings against state and byte costs and validate complete trees before keeping the change.`,
        );
      }
    },
  };
}, "Suggest retaining hidden boundaries for inlined literal choices with nonterminal aliases");
