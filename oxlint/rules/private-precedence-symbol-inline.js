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
import { rootMetadataSymbols } from "../helpers/project-metadata.js";

export const privatePrecedenceSymbolInline = rule((context) => {
  const properties = [],
    references = new Map(),
    restricted = rootMetadataSymbols(context, [
      "inline",
      "conflicts",
      "precedences",
      "supertypes",
      "externals",
    ]);
  let dynamicReference = false;
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
      if (!name) {
        if (node.computed && node.object.type === "Identifier" && node.object.name === "$")
          dynamicReference = true;
        return;
      }
      if (!references.has(name)) references.set(name, []);
      references.get(name).push(node);
    },
    "Program:exit"() {
      if (dynamicReference) return;
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (!name.startsWith("__") || restricted.has(name) || isRuleDisabled(context, property))
          continue;
        if (!["prec", "prec.left", "prec.right"].includes(callName(body))) continue;
        if (!isStaticDsl(body)) continue;
        let value = body;
        while (["prec", "prec.left", "prec.right"].includes(callName(value))) {
          if (
            value.arguments.length < 1 ||
            value.arguments.length > 2 ||
            (callName(value) === "prec" && value.arguments.length !== 2)
          )
            break;
          if (!value.arguments.slice(0, -1).every((part) => part.type === "Literal")) break;
          value = value.arguments.at(-1);
        }
        if (!memberName(value) || memberName(value) === name) continue;
        const recursive = (symbol, seen = new Set()) => {
          if (symbol === name) return true;
          if (seen.has(symbol)) return false;
          seen.add(symbol);
          const target = properties.find(
            (other) => other.parent === property.parent && ruleName(other) === symbol,
          );
          return target
            ? referencedSymbols(target.value.body).some((reference) => recursive(reference, seen))
            : false;
        };
        if (recursive(memberName(value))) continue;
        const uses = references.get(name) ?? [];
        if (uses.length < 2) continue;
        const safe = uses.every((use) => {
          const owner = enclosingRule(use);
          if (use.computed || !owner || owner === property || owner.parent !== property.parent)
            return false;
          for (let parent = use.parent; parent !== owner; parent = parent.parent) {
            if (
              parent.type === "CallExpression" &&
              (![
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
                !isStaticDsl(parent))
            )
              return false;
          }
          return true;
        });
        if (!safe) continue;
        report(
          context,
          property,
          "private-precedence-symbol-inline",
          `${name} only wraps a symbol in static precedence at ${uses.length} unaliased local uses; try adding it to grammar.inline. Preserve the complete precedence chain, associativity and caller fields, check cross-file references and metadata, then measure parser counts and bytes and validate trees.`,
        );
      }
    },
  };
}, "Suggest metadata inlining of repeatedly used private static-precedence symbol wrappers");
