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
import {
  projectPrecedenceSymbols,
  rootInlineSymbols,
  rootMetadataSymbols,
} from "../helpers/project-metadata.js";

export const contextualKeywordChoiceBoundary = rule((context) => {
  const inlined = rootInlineSymbols(context),
    restricted = rootMetadataSymbols(context, ["conflicts", "supertypes", "externals", "word"]),
    properties = [];
  for (const name of projectPrecedenceSymbols(context)) restricted.add(name);
  let dynamicReference = false;
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
    MemberExpression(node) {
      const name = memberName(node);
      if (!name) {
        if (node.computed && node.object.type === "Identifier" && node.object.name === "$")
          dynamicReference = true;
        return;
      }
      const owner = enclosingRule(node);
      for (let parent = node.parent; parent && parent !== owner; parent = parent.parent) {
        if (["alias", "token", "token.immediate"].includes(callName(parent))) restricted.add(name);
        if (
          !owner &&
          parent.type === "Property" &&
          ["conflicts", "precedences", "supertypes", "externals", "word"].includes(ruleName(parent))
        )
          restricted.add(name);
      }
    },
    "Program:exit"() {
      if (dynamicReference) return;
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (
          !name.startsWith("_") ||
          name.startsWith("_kw_") ||
          !inlined.has(name) ||
          restricted.has(name) ||
          isRuleDisabled(context, property) ||
          isRuleDisabled(context, body) ||
          callName(body) !== "choice" ||
          body.arguments.length < 2 ||
          body.arguments.length > 7
        )
          continue;
        const alternatives = body.arguments.map(memberName);
        if (
          alternatives.some((symbol) => !symbol?.startsWith("_kw_")) ||
          new Set(alternatives).size !== alternatives.length
        )
          continue;
        report(
          context,
          property,
          "contextual-keyword-choice-boundary",
          `${name} expands a bare keyword family through grammar.inline; try retaining its hidden selector boundary in declaration contexts while keeping the exact choice expanded in expression/value and dynamic-precedence contexts. Preserve keyword order, abbreviations, caller fields and precedence; check cross-file uses and aliases without changing the ambiguity policy, then measure large states, actions and table bytes and compare complete valid and recovery trees including anonymous fields.`,
        );
      }
    },
  };
}, "Suggest measured declaration boundaries for inlined bare keyword families");
