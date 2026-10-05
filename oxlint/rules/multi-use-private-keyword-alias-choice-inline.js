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
import { projectPrecedenceSymbols, rootMetadataSymbols } from "../helpers/project-metadata.js";

export const multiUsePrivateKeywordAliasChoiceInline = rule((context) => {
  const properties = [],
    references = new Map(),
    restricted = rootMetadataSymbols(context, ["inline", "conflicts", "supertypes", "externals"]);
  for (const name of projectPrecedenceSymbols(context)) restricted.add(name);
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
      const uses = references.get(name) ?? [];
      uses.push(node);
      references.set(name, uses);
      if (!enclosingRule(node)) restricted.add(name);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (!name.startsWith("__") || restricted.has(name) || isRuleDisabled(context, property))
          continue;
        if (callName(body) !== "choice" || body.arguments.length < 3 || body.arguments.length > 8)
          continue;
        let keywordAliases = 0,
          symbols = 0;
        const alternativesMatch = body.arguments.every((alternative) => {
          const symbol = memberName(alternative);
          if (symbol && !symbol.startsWith("_")) {
            symbols += 1;
            return true;
          }
          if (callName(alternative) !== "alias" || alternative.arguments.length !== 2) return false;
          const [source, target] = alternative.arguments;
          const targetName = memberName(target);
          if (!isStaticKeywordCall(source) || !targetName || targetName.startsWith("_"))
            return false;
          keywordAliases += 1;
          return true;
        });
        if (!alternativesMatch || keywordAliases < 2 || symbols < 1) continue;
        const uses = references.get(name) ?? [];
        if (uses.length < 2) continue;
        if (
          !uses.every((use) => {
            const owner = enclosingRule(use);
            if (use.computed || !owner || owner === property || owner.parent !== property.parent)
              return false;
            for (let parent = use.parent; parent !== owner; parent = parent.parent) {
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
                return false;
            }
            return true;
          })
        )
          continue;
        report(
          context,
          property,
          "multi-use-private-keyword-alias-choice-inline",
          `${name} has ${uses.length} unaliased local uses of a private choice mixing named keyword aliases and public symbols; try adding it to grammar.inline. Check cross-file uses and metadata, preserve keyword identity, alternative order and alias visibility, then measure parser counts and bytes and validate complete trees.`,
        );
      }
    },
  };
}, "Suggest metadata inlining of multiply used private keyword-alias choices with public symbols");
