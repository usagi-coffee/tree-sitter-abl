import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isStaticDsl,
  isStaticKeywordCall,
  memberName,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { projectPrecedenceSymbols, rootMetadataSymbols } from "../helpers/project-metadata.js";

export const prefixedSelectorHeadExtraction = rule((context) => {
  const restricted = rootMetadataSymbols(context, [
    "inline",
    "conflicts",
    "precedences",
    "supertypes",
    "externals",
    "extras",
    "word",
  ]);
  for (const name of projectPrecedenceSymbols(context)) restricted.add(name);
  const candidates = [];
  let dynamicMetadata = false;
  const keyword = (node) => memberName(node)?.startsWith("_kw_") || isStaticKeywordCall(node);
  const signature = (node) =>
    JSON.stringify(context.sourceCode.getTokens(node).map(({ type, value }) => [type, value]));
  const unsafe = (node) =>
    Boolean(node?.regex) ||
    isRuleDisabled(context, node) ||
    ["token", "token.immediate", "prec.dynamic"].includes(callName(node)) ||
    (node?.type === "CallExpression" && node.arguments.some(unsafe));
  return {
    MemberExpression(node) {
      if (enclosingRule(node)) return;
      const name = memberName(node);
      if (name) restricted.add(name);
      else if (node.computed && node.object.type === "Identifier" && node.object.name === "$") {
        if (node.property.type === "Literal" && typeof node.property.value === "string")
          restricted.add(node.property.value);
        else dynamicMetadata = true;
      }
    },
    CallExpression(node) {
      if (callName(node) === "seq" && node.arguments.length >= 4) candidates.push(node);
    },
    "Program:exit"() {
      if (dynamicMetadata) return;
      for (const sequence of candidates) {
        const owner = enclosingRule(sequence);
        if (
          !owner ||
          restricted.has(ruleName(owner)) ||
          isRuleDisabled(context, owner) ||
          !isStaticDsl(sequence) ||
          unsafe(sequence) ||
          referencedSymbols(sequence).includes(ruleName(owner))
        )
          continue;
        const [prefix, selector, value] = sequence.arguments;
        if (
          !keyword(prefix) ||
          callName(selector) !== "choice" ||
          selector.arguments.length < 2 ||
          !selector.arguments.every(keyword) ||
          new Set(selector.arguments.map(signature)).size !== selector.arguments.length ||
          callName(value) !== "field" ||
          value.arguments.length !== 2 ||
          value.arguments[0].type !== "Literal" ||
          typeof value.arguments[0].value !== "string" ||
          !memberName(value.arguments[1]) ||
          keyword(value.arguments[1])
        )
          continue;
        let unsupportedScope = false;
        for (let parent = sequence.parent; parent !== owner; parent = parent.parent) {
          if (
            isRuleDisabled(context, parent) ||
            (parent.type === "CallExpression" &&
              ![
                "seq",
                "choice",
                "optional",
                "repeat",
                "repeat1",
                "prec",
                "prec.left",
                "prec.right",
              ].includes(callName(parent)))
          )
            unsupportedScope = true;
        }
        if (unsupportedScope) continue;
        report(
          context,
          sequence,
          "prefixed-selector-head-extraction",
          `A fixed keyword precedes a keyword selector and required ${value.arguments[0].value} field; try extracting only the prefix and complete selector into a hidden head, leaving the field and suffix at the caller. Preserve token identity, keyword options, alternative order, fields, aliases and enclosing precedence. Measure ACTION_COUNT, Wasm memory and parsing speed, and compare complete valid and recovery trees before retaining the boundary.`,
        );
      }
    },
  };
}, "Suggest hidden heads for fixed keyword prefixes and keyword selectors before required fields");
