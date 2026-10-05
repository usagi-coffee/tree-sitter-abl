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
  unwrap,
} from "../helpers.js";
import { projectPrecedenceSymbols, rootMetadataSymbols } from "../helpers/project-metadata.js";

export const aliasForwardingInline = rule((context) => {
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
      if (!references.has(name)) references.set(name, []);
      references.get(name).push(node);
      if (!enclosingRule(node)) restricted.add(name);
    },
    "Program:exit"() {
      if (dynamicReference) return;
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (
          !name.startsWith("_") ||
          restricted.has(name) ||
          isRuleDisabled(context, property) ||
          isRuleDisabled(context, body) ||
          callName(body) !== "alias" ||
          body.arguments.length !== 2
        )
          continue;
        const source = memberName(body.arguments[0]),
          target = memberName(body.arguments[1]);
        if (!source || source === name || !target || target.startsWith("_")) continue;
        const definition = properties.find(
          (other) => other.parent === property.parent && ruleName(other) === source,
        );
        if (
          !definition ||
          !["seq", "choice"].includes(callName(unwrap(definition.value.body))) ||
          !isStaticDsl(definition.value.body)
        )
          continue;
        const recursive = (symbol, seen = new Set()) => {
          if (symbol === name) return true;
          if (seen.has(symbol)) return false;
          seen.add(symbol);
          const rule = properties.find(
            (other) => other.parent === property.parent && ruleName(other) === symbol,
          );
          return rule
            ? referencedSymbols(rule.value.body).some((reference) => recursive(reference, seen))
            : false;
        };
        if (recursive(source)) continue;
        const safe = (references.get(name) ?? []).every((use) => {
          const owner = enclosingRule(use);
          if (!owner || owner === property || owner.parent !== property.parent) return false;
          for (let parent = use.parent; parent !== owner; parent = parent.parent) {
            if (
              parent.type === "CallExpression" &&
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
              ].includes(callName(parent))
            )
              return false;
          }
          return true;
        });
        if (!safe) continue;
        report(
          context,
          property,
          "alias-forwarding-inline",
          `${name} only forwards the named nonterminal alias ${source} as ${target}; try adding this wrapper to grammar.inline while retaining the aliased source rule. Preserve the exact alias and caller fields, check cross-file aliases and metadata, then measure symbol count, dense-table and compiled bytes as well as states/actions and compare complete valid and error trees.`,
        );
      }
    },
  };
}, "Suggest eliminating hidden alias-forwarding boundaries while retaining the aliased nonterminal");
