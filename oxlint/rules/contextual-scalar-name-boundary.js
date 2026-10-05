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

export const contextualScalarNameBoundary = rule((context) => {
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
        if (["alias", "token", "token.immediate", "prec.dynamic"].includes(callName(parent)))
          restricted.add(name);
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
          !alternatives.includes("identifier") ||
          !alternatives.some((symbol) => symbol?.endsWith("_literal")) ||
          alternatives.some(
            (symbol) =>
              !symbol ||
              symbol.startsWith("_") ||
              (symbol !== "identifier" && !symbol.endsWith("_literal")),
          ) ||
          new Set(alternatives).size !== alternatives.length
        )
          continue;
        const retainedBoundary = properties.some((candidate) => {
          const candidateName = ruleName(candidate);
          return (
            candidateName.startsWith("_") &&
            !candidateName.startsWith("_kw_") &&
            !inlined.has(candidateName) &&
            memberName(candidate.value.body) === name
          );
        });
        if (retainedBoundary) continue;
        report(
          context,
          property,
          "contextual-scalar-name-boundary",
          `${name} expands identifiers and literal nodes through grammar.inline; try a non-inlined hidden forwarding helper at selected name/value fields while keeping the original selector expanded at other callers. Measure caller groups separately: combining lookahead contexts can change punctuation visibility and malformed-value recovery. Preserve token identities, alternative order, field scopes and metadata, then compare parser counts and bytes and validate complete trees, recovery and required-field metadata.`,
        );
      }
    },
  };
}, "Suggest measured caller-specific boundaries for inlined identifier and literal selectors");
