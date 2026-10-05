import {
  callName,
  dslSignature,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  isStaticDsl,
  isStaticKeywordCall,
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

export const inlineKeywordAliasChoiceBoundary = rule((context) => {
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
          body.arguments.length > 8 ||
          !isStaticDsl(body)
        )
          continue;
        let target = null;
        const keywords = new Set();
        const matches = body.arguments.every((alternative) => {
          if (callName(alternative) !== "alias" || alternative.arguments.length !== 2) return false;
          const [keyword, aliasTarget] = alternative.arguments;
          if (!isStaticKeywordCall(keyword)) return false;
          const aliasName = memberName(aliasTarget);
          if (!aliasName || aliasName.startsWith("_") || (target !== null && target !== aliasName))
            return false;
          const signature = dslSignature(keyword);
          if (keywords.has(signature)) return false;
          keywords.add(signature);
          target = aliasName;
          return true;
        });
        if (!matches) continue;
        report(
          context,
          property,
          "inline-keyword-alias-choice-boundary",
          `${name} expands a keyword family aliased as ${target} through grammar.inline; try removing its inline entry to retain a hidden flag boundary. Preserve keyword options, alias targets, alternative order and caller fields, check cross-file aliases and metadata, then compare action savings against state and byte costs and validate complete trees, error recovery and required-field metadata.`,
        );
      }
    },
  };
}, "Suggest retaining boundaries for inlined keyword families sharing one public alias target");
