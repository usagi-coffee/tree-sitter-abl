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

export const sharedKeywordPairFieldInline = rule((context) => {
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
  const keyword = (node) => memberName(node)?.startsWith("_kw_") || isStaticKeywordCall(node);
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
          !name.startsWith("_") ||
          name.startsWith("__") ||
          name.startsWith("_kw_") ||
          name.endsWith("_body") ||
          restricted.has(name) ||
          isRuleDisabled(context, property) ||
          callName(body) !== "seq" ||
          body.arguments.length !== 3 ||
          !isStaticDsl(body) ||
          suppressed(body)
        )
          continue;
        const [first, second, value] = body.arguments;
        if (
          !keyword(first) ||
          !keyword(second) ||
          callName(value) !== "field" ||
          value.arguments.length !== 2 ||
          value.arguments[0].type !== "Literal" ||
          typeof value.arguments[0].value !== "string" ||
          !memberName(value.arguments[1])
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
            ? !isStaticDsl(definition.value.body) ||
                referencedSymbols(definition.value.body).some((next) => recursive(next, seen))
            : false;
        };
        if (referencedSymbols(body).some((symbol) => recursive(symbol))) continue;
        if (
          !(references.get(name) ?? []).every((use) => {
            const owner = enclosingRule(use);
            if (!owner || owner === property || isRuleDisabled(context, owner)) return false;
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
          "shared-keyword-pair-field-inline",
          `${name} is a shared keyword pair followed by a required field; try adding it to grammar.inline. Check cross-file uses, aliases, recursion and metadata. Preserve both keywords, token identities, field scope and caller precedence, then compare actions, table bytes, memory, parsing speed and complete valid and recovery trees before retaining the change.`,
        );
      }
    },
  };
}, "Suggest inlining shared helpers containing two keywords and a required field");
