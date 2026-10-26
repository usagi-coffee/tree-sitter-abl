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

export const multiUsePrivateKeywordOptionalTailInline = rule((context) => {
  const properties = [],
    references = new Map(),
    restricted = rootMetadataSymbols(context, [
      "inline",
      "conflicts",
      "precedences",
      "supertypes",
      "externals",
      "extras",
      "word",
    ]);
  for (const name of projectPrecedenceSymbols(context)) restricted.add(name);
  let dynamicReference = false;
  const suppressed = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" && node.arguments.some(suppressed));
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
          callName(body) !== "seq" ||
          body.arguments.length !== 2 ||
          !isStaticDsl(body) ||
          suppressed(body)
        )
          continue;
        const [keyword, optionalTail] = body.arguments;
        if (
          (!isStaticKeywordCall(keyword) && !memberName(keyword)?.startsWith("_kw_")) ||
          callName(optionalTail) !== "optional" ||
          optionalTail.arguments.length !== 1
        )
          continue;
        const tail = memberName(optionalTail.arguments[0]);
        if (!tail?.startsWith("_")) continue;
        const definition = (symbol) =>
          properties.find(
            (other) => other.parent === property.parent && ruleName(other) === symbol,
          );
        if (!definition(tail)) continue;
        const recursive = (symbol, seen = new Set()) => {
          if (symbol === name) return true;
          if (seen.has(symbol)) return false;
          seen.add(symbol);
          const target = definition(symbol);
          return target
            ? !isStaticDsl(target.value.body) ||
                referencedSymbols(target.value.body).some((next) => recursive(next, seen))
            : false;
        };
        if (referencedSymbols(body).some((symbol) => recursive(symbol))) continue;
        const uses = references.get(name) ?? [];
        if (uses.length < 2) continue;
        if (
          !uses.every((use) => {
            const owner = enclosingRule(use);
            if (
              !owner ||
              owner === property ||
              owner.parent !== property.parent ||
              isRuleDisabled(context, owner)
            )
              return false;
            for (let current = use; current !== owner; current = current.parent) {
              if (isRuleDisabled(context, current)) return false;
              if (
                current.type === "CallExpression" &&
                (![
                  "seq",
                  "choice",
                  "optional",
                  "repeat",
                  "repeat1",
                  "prec",
                  "prec.left",
                  "prec.right",
                ].includes(callName(current)) ||
                  !isStaticDsl(current))
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
          "multi-use-private-keyword-optional-tail-inline",
          `${name} has ${uses.length} unaliased local uses of a keyword followed by an optional hidden tail; try adding it to grammar.inline. Check cross-file uses and metadata, preserve keyword identity, tail fields and aliases, caller optionality and precedence, then compare actions, table bytes, memory, parsing speed and complete valid and recovery trees before retaining the change.`,
        );
      }
    },
  };
}, "Suggest inlining multiply used private keyword clauses with optional hidden tails");
