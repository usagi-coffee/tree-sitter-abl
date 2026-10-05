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
import { projectPrecedenceSymbols, rootMetadataSymbols } from "../helpers/project-metadata.js";

export const leadingKeywordFieldBoundary = rule((context) => {
  const properties = [],
    restricted = rootMetadataSymbols(context, [
      "inline",
      "conflicts",
      "precedences",
      "supertypes",
      "externals",
      "word",
    ]);
  for (const name of projectPrecedenceSymbols(context)) restricted.add(name);
  let dynamicMetadata = false;
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
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
    "Program:exit"() {
      if (dynamicMetadata) return;
      for (const property of properties) {
        if (restricted.has(ruleName(property)) || isRuleDisabled(context, property)) continue;
        let sequence = property.value.body;
        while (["prec", "prec.left", "prec.right"].includes(callName(sequence)))
          sequence = sequence.arguments.at(-1);
        if (
          callName(sequence) !== "seq" ||
          sequence.arguments.length < 2 ||
          !isStaticDsl(sequence) ||
          isRuleDisabled(context, sequence)
        )
          continue;
        const [keywords, value] = sequence.arguments;
        if (
          callName(keywords) !== "choice" ||
          keywords.arguments.length < 2 ||
          keywords.arguments.length > 7 ||
          !keywords.arguments.every(
            (branch) => memberName(branch)?.startsWith("_kw_") || isStaticKeywordCall(branch),
          ) ||
          new Set(keywords.arguments.map(dslSignature)).size !== keywords.arguments.length ||
          callName(value) !== "field" ||
          value.arguments.length !== 2 ||
          value.arguments[0].type !== "Literal" ||
          typeof value.arguments[0].value !== "string"
        )
          continue;
        const contents = value.arguments[1],
          alternatives = callName(contents) === "choice" ? contents.arguments : [contents];
        if (
          alternatives.length === 0 ||
          !alternatives.every((branch) => memberName(branch) !== null) ||
          [keywords, value, ...keywords.arguments].some((node) => isRuleDisabled(context, node))
        )
          continue;
        report(
          context,
          keywords,
          "leading-keyword-field-boundary",
          `This leading keyword choice precedes the required ${value.arguments[0].value} field; try retaining only the exact ordered keyword family in a hidden selector, leaving the complete field and suffix at the caller. Preserve distinct tokens, keyword options, fields and enclosing precedence, check metadata and competing reductions, then measure large states, actions and table bytes and compare complete valid and recovery trees before keeping the boundary.`,
        );
      }
    },
  };
}, "Suggest measured boundaries for leading keyword choices before required valued fields");
