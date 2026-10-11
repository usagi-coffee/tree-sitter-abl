import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  isStaticDsl,
  memberName,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { projectPrecedenceSymbols, rootMetadataSymbols } from "../helpers/project-metadata.js";

export const multiUseRequiredTailChoiceInline = rule((context) => {
  const properties = [],
    references = new Map(),
    restricted = rootMetadataSymbols(context, [
      "inline",
      "conflicts",
      "supertypes",
      "externals",
      "extras",
      "word",
    ]);
  for (const name of projectPrecedenceSymbols(context)) restricted.add(name);
  let dynamicReference = false;
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      if (node.object.type !== "Identifier" || node.object.name !== "$") return;
      const name = memberName(node);
      if (!name) {
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
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (
          !name.startsWith("__") ||
          restricted.has(name) ||
          isRuleDisabled(context, property) ||
          isRuleDisabled(context, body) ||
          callName(body) !== "choice" ||
          body.arguments.length !== 2
        )
          continue;
        const [sequence, fallback] = body.arguments;
        if (callName(sequence) !== "seq" || sequence.arguments.length !== 2) continue;
        const [prefix, tail] = sequence.arguments,
          prefixName = memberName(prefix),
          tailName = memberName(tail);
        if (
          !prefixName ||
          !tailName ||
          prefixName === tailName ||
          tailName !== memberName(fallback) ||
          [sequence, prefix, tail, fallback].some((part) => isRuleDisabled(context, part))
        )
          continue;
        const recursive = (symbol, seen = new Set()) => {
          if (symbol === name) return true;
          if (seen.has(symbol)) return false;
          seen.add(symbol);
          const definition = properties.find(
            (other) => other.parent === property.parent && ruleName(other) === symbol,
          );
          return definition
            ? referencedSymbols(definition.value.body).some((next) => recursive(next, seen))
            : false;
        };
        if (recursive(prefixName) || recursive(tailName)) continue;
        const uses = references.get(name) ?? [];
        if (uses.length < 2) continue;
        if (
          !uses.every((use) => {
            const owner = enclosingRule(use);
            if (
              !owner ||
              owner === property ||
              owner.parent !== property.parent ||
              isRuleDisabled(context, owner) ||
              isRuleDisabled(context, use)
            )
              return false;
            for (let parent = use.parent; parent !== owner; parent = parent.parent) {
              if (isRuleDisabled(context, parent)) return false;
              if (parent === owner.value) continue;
              if (
                ![
                  "seq",
                  "choice",
                  "field",
                  "optional",
                  "repeat",
                  "repeat1",
                  "prec",
                  "prec.left",
                  "prec.right",
                ].includes(callName(parent)) ||
                !isStaticDsl(parent)
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
          "multi-use-required-tail-choice-inline",
          `${name} has ${uses.length} unaliased local uses of a choice between a prefix with a required tail and the same tail alone; try adding the complete helper to grammar.inline. Preserve both alternatives, the required tail, caller fields and precedence; check cross-file uses and metadata, measure LARGE_STATE_COUNT before ACTION_COUNT, and compare complete valid and recovery trees.`,
        );
      }
    },
  };
}, "Suggest inlining reused private choices with an optional prefix and a common required tail");
