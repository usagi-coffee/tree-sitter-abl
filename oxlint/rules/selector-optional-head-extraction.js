import {
  callName,
  dslSignature,
  enclosingRule,
  hasField,
  isNullable,
  isRuleDisabled,
  isRuleProperty,
  isStaticDsl,
  isStaticKeywordCall,
  memberName,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { projectPrecedenceSymbols, rootMetadataSymbols } from "../helpers/project-metadata.js";

export const selectorOptionalHeadExtraction = rule((context) => {
  const candidates = [],
    definitions = [],
    restricted = rootMetadataSymbols(context, [
      "inline",
      "conflicts",
      "precedences",
      "supertypes",
      "externals",
      "word",
    ]);
  for (const name of projectPrecedenceSymbols(context)) restricted.add(name);
  const keyword = (node) => memberName(node)?.startsWith("_kw_") || isStaticKeywordCall(node);
  const optional = (node) => callName(node) === "optional" && node.arguments.length === 1;
  const lexicalOrDynamic = (node) =>
    Boolean(node?.regex) ||
    ["token", "token.immediate", "prec.dynamic"].includes(callName(node)) ||
    (node?.type === "CallExpression" && node.arguments.some(lexicalOrDynamic));
  return {
    Property(node) {
      if (isRuleProperty(node)) definitions.push(node);
    },
    CallExpression(node) {
      if (callName(node) === "seq" && node.arguments.length >= 4) candidates.push(node);
    },
    "Program:exit"() {
      for (const sequence of candidates) {
        const owner = enclosingRule(sequence);
        if (
          !owner ||
          restricted.has(ruleName(owner)) ||
          !isStaticDsl(sequence) ||
          lexicalOrDynamic(sequence)
        )
          continue;
        const [selector, clause, ...tail] = sequence.arguments;
        if (
          callName(selector) !== "choice" ||
          selector.arguments.filter(keyword).length < 2 ||
          !selector.arguments.some((part) => !keyword(part)) ||
          !selector.arguments.every(
            (part) =>
              keyword(part) ||
              (callName(part) === "seq" && keyword(part.arguments[0]) && hasField(part)),
          ) ||
          new Set(selector.arguments.map(dslSignature)).size !== selector.arguments.length ||
          !optional(clause) ||
          !memberName(clause.arguments[0])?.startsWith("_") ||
          keyword(clause.arguments[0]) ||
          restricted.has(memberName(clause.arguments[0])) ||
          !tail.every(optional) ||
          !tail.some((part) => callName(part.arguments[0]) === "seq") ||
          referencedSymbols(sequence).includes(ruleName(owner))
        )
          continue;
        const clauseName = memberName(clause.arguments[0]);
        const definition = definitions.find(
          (property) => property.parent === owner.parent && ruleName(property) === clauseName,
        );
        if (definition) {
          let body = definition.value.body;
          while (["prec", "prec.left", "prec.right"].includes(callName(body)))
            body = body.arguments.at(-1);
          if (
            !isStaticDsl(definition.value.body) ||
            lexicalOrDynamic(definition.value.body) ||
            callName(body) !== "seq" ||
            callName(body.arguments[0]) !== "field" ||
            isNullable(body) ||
            referencedSymbols(body).includes(clauseName) ||
            isRuleDisabled(context, definition) ||
            isRuleDisabled(context, body)
          )
            continue;
        }
        let unsafe = false;
        for (let parent = sequence; parent !== owner; parent = parent.parent) {
          if (
            isRuleDisabled(context, parent) ||
            (parent.type === "CallExpression" &&
              !["seq", "choice", "optional", "prec", "prec.left", "prec.right"].includes(
                callName(parent),
              ))
          )
            unsafe = true;
        }
        if (
          unsafe ||
          isRuleDisabled(context, owner) ||
          [selector, clause, clause.arguments[0], ...selector.arguments, ...tail].some((part) =>
            isRuleDisabled(context, part),
          )
        )
          continue;
        report(
          context,
          sequence,
          "selector-optional-head-extraction",
          `This mixed keyword selector precedes optional ${clauseName} and ordered optional tails; try moving the selector and the expanded optional clause into one hidden head. Inspect the clause definition and metadata first: expand only a non-recursive field-led sequence, preserving its complete precedence, fields, aliases and optionality. Retain distinct keyword tokens and the valued selector branches, leave the remaining tails at the caller, and measure ACTION_COUNT, Wasm memory and parsing speed while comparing complete valid and recovery trees.`,
        );
      }
    },
  };
}, "Suggest moving a mixed selector and expanded optional valued clause into one hidden head");
