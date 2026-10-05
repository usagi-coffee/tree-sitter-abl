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
import {
  projectPrecedenceSymbols,
  rootInlineSymbols,
  rootMetadataSymbols,
} from "../helpers/project-metadata.js";

export const inlineTargetForwarding = rule((context) => {
  const properties = [],
    references = new Map(),
    inlineNames = rootInlineSymbols(context),
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
          target = memberName(property.value.body);
        if (
          !name.startsWith("_") ||
          name.startsWith("__") ||
          restricted.has(name) ||
          !target?.startsWith("_") ||
          target === name ||
          !inlineNames.has(target) ||
          isRuleDisabled(context, property) ||
          isRuleDisabled(context, property.value.body)
        )
          continue;
        const definition = properties.find(
          (other) => other.parent === property.parent && ruleName(other) === target,
        );
        if (
          !definition ||
          !["seq", "choice"].includes(callName(definition.value.body)) ||
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
        if (recursive(target)) continue;
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
          "inline-target-forwarding",
          `${name} retains a forwarding boundary to already-inline ${target}; try adding this shared wrapper to grammar.inline. Preserve the target structure and caller fields, check cross-file aliases and metadata, then measure symbols, dense-table and compiled bytes as well as states/actions and compare complete valid and error trees.`,
        );
      }
    },
  };
}, "Suggest inlining shared symbol-forwarding wrappers whose structured target is already inline");
