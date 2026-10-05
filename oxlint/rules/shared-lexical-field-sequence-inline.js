import {
  callName,
  enclosingRule,
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

export const sharedLexicalFieldSequenceInline = rule((context) => {
  const properties = [],
    references = new Map(),
    restricted = rootMetadataSymbols(context, [
      "inline",
      "conflicts",
      "precedences",
      "supertypes",
      "externals",
      "word",
    ]);
  for (const name of projectPrecedenceSymbols(context)) restricted.add(name);
  let dynamicReference = false;
  const lexical = (node) =>
    (node?.type === "Literal" && (typeof node.value === "string" || Boolean(node.regex))) ||
    (["token", "token.immediate"].includes(callName(node)) &&
      node.arguments.length === 1 &&
      isStaticDsl(node) &&
      referencedSymbols(node).length === 0);
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      const name = memberName(node);
      if (!name) {
        if (node.computed && node.object.type === "Identifier" && node.object.name === "$")
          dynamicReference = true;
        return;
      }
      const uses = references.get(name) ?? [];
      uses.push(node);
      references.set(name, uses);
      if (!enclosingRule(node)) restricted.add(name);
    },
    "Program:exit"() {
      if (dynamicReference) return;
      const definitions = new Map(properties.map((property) => [ruleName(property), property]));
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (
          !name.startsWith("__") ||
          restricted.has(name) ||
          isRuleDisabled(context, property) ||
          isRuleDisabled(context, body) ||
          callName(body) !== "seq" ||
          body.arguments.length < 2 ||
          body.arguments.length > 4
        )
          continue;
        if (
          !body.arguments.every((part) => {
            if (
              callName(part) !== "field" ||
              part.arguments.length !== 2 ||
              part.arguments[0].type !== "Literal" ||
              typeof part.arguments[0].value !== "string" ||
              isRuleDisabled(context, part)
            )
              return false;
            const target = memberName(part.arguments[1]),
              definition = definitions.get(target);
            return (
              target &&
              !target.startsWith("_") &&
              definition?.parent === property.parent &&
              lexical(definition.value.body)
            );
          })
        )
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length < 2) continue;
        if (
          !uses.every((use) => {
            const owner = enclosingRule(use);
            if (
              !owner ||
              ruleName(owner).startsWith("_") ||
              owner.parent !== property.parent ||
              isRuleDisabled(context, owner) ||
              isRuleDisabled(context, use)
            )
              return false;
            let sequence = owner.value.body;
            while (["prec", "prec.left", "prec.right"].includes(callName(sequence))) {
              if (!isStaticDsl(sequence)) return false;
              sequence = sequence.arguments.at(-1);
            }
            return (
              callName(sequence) === "seq" &&
              use.parent === sequence &&
              sequence.arguments.length >= 2 &&
              sequence.arguments.at(-1) === use &&
              sequence.arguments
                .slice(0, -1)
                .every((part) => lexical(part) || isStaticKeywordCall(part))
            );
          })
        )
          continue;
        report(
          context,
          property,
          "shared-lexical-field-sequence-inline",
          `${name} shares required lexical fields at the end of ${uses.length} public rules; try adding it to grammar.inline. Check cross-file references and metadata, preserve token identity, field scope and order, then measure large states before actions and compare complete valid and recovery trees.`,
        );
      }
    },
  };
}, "Suggest measuring inlining of shared terminal field sequences after lexical prefixes");
