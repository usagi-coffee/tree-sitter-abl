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
import {
  keywordInlineSymbols,
  projectPrecedenceSymbols,
  rootMetadataSymbols,
} from "../helpers/project-metadata.js";

export const contextualKeywordPrefixBoundary = rule((context) => {
  const inlined = keywordInlineSymbols(context),
    restricted = rootMetadataSymbols(context, ["conflicts", "supertypes", "externals", "word"]),
    definitions = new Map(),
    sequences = [];
  for (const name of projectPrecedenceSymbols(context)) restricted.add(name);
  let dynamicReference = false;
  return {
    Property(node) {
      if (isRuleProperty(node)) definitions.set(ruleName(node), node.value.body);
      if (ruleName(node) === "inline" && node.value?.body?.type === "ArrayExpression") {
        for (const element of node.value.body.elements) {
          const name = memberName(element);
          if (name) inlined.add(name);
        }
      }
    },
    CallExpression(node) {
      if (callName(node) === "seq" && enclosingRule(node)) sequences.push(node);
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
      const reported = new Set();
      for (const node of sequences) {
        const [keyword, value] = node.arguments,
          name = memberName(keyword),
          owner = enclosingRule(node);
        if (
          !name?.startsWith("_kw_") ||
          !inlined.has(name) ||
          restricted.has(name) ||
          reported.has(name) ||
          (definitions.has(name) && !isStaticKeywordCall(definitions.get(name))) ||
          isRuleDisabled(context, node) ||
          isRuleDisabled(context, owner) ||
          callName(value) !== "field" ||
          value.arguments.length !== 2 ||
          value.arguments[0].type !== "Literal" ||
          typeof value.arguments[0].value !== "string"
        )
          continue;
        const body = value.arguments[1],
          alternatives = callName(body) === "choice" ? body.arguments : [body],
          symbols = alternatives.map(memberName),
          phrases = symbols.filter(
            (symbol) => symbol && !symbol.startsWith("_") && symbol.endsWith("_phrase"),
          );
        if (
          phrases.length !== 1 ||
          symbols.some(
            (symbol) => !symbol || (symbol !== phrases[0] && !symbol.startsWith("_kw_")),
          ) ||
          new Set(symbols).size !== symbols.length
        )
          continue;
        report(
          context,
          node,
          "contextual-keyword-prefix-boundary",
          `${name} expands before the phrase-valued ${JSON.stringify(value.arguments[0].value)} field; try retaining its hidden keyword boundary at phrase callers while keeping the exact keyword expansion before general expressions. Check all callers, aliases and metadata, preserve keyword options and field scopes, then prioritize LARGE_STATE_COUNT followed by ACTION_COUNT and validate complete valid and recovery trees.`,
        );
        reported.add(name);
      }
    },
  };
}, "Suggest measured keyword boundaries at phrase-valued clauses while keeping expression callers expanded");
