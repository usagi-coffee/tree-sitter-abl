import {
  callName,
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

export const precedenceKeywordAliasInline = rule((context) => {
  const properties = [],
    references = new Map(),
    ordered = projectPrecedenceSymbols(context),
    restricted = rootMetadataSymbols(context, ["inline", "conflicts", "supertypes", "externals"]);
  let dynamicReference = false;
  return {
    Property(node) {
      if (!isRuleProperty(node)) return;
      let parent = node;
      while (parent.parent && parent.type !== "ExportDefaultDeclaration") parent = parent.parent;
      if (parent.type === "ExportDefaultDeclaration") properties.push(node);
    },
    MemberExpression(node) {
      const name = memberName(node);
      if (!name) {
        if (node.computed && node.object.type === "Identifier" && node.object.name === "$")
          dynamicReference = true;
        return;
      }
      if (!enclosingRule(node)) {
        for (let parent = node.parent; parent; parent = parent.parent) {
          if (parent.type !== "Property") continue;
          const metadata = ruleName(parent);
          if (metadata === "precedences") ordered.add(name);
          if (["inline", "conflicts", "supertypes", "externals"].includes(metadata))
            restricted.add(name);
        }
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
        if (
          !name.startsWith("__") ||
          !ordered.has(name) ||
          restricted.has(name) ||
          isRuleDisabled(context, property) ||
          callName(body) !== "alias" ||
          body.arguments.length !== 2
        )
          continue;
        const [source, target] = body.arguments,
          destination = memberName(target);
        if (
          !(memberName(source)?.startsWith("_kw_") || isStaticKeywordCall(source)) ||
          !destination ||
          destination.startsWith("_")
        )
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length === 0) continue;
        const safe = uses.every((use) => {
          const owner = enclosingRule(use);
          if (!owner || owner === property || owner.parent !== property.parent) return false;
          if (callName(use.parent) === "alias") return false;
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
          "precedence-keyword-alias-inline",
          `${name} aliases a keyword at ${uses.length} local uses and has declared rule precedence; try transferring every ordering involving this rule to named precedence attached to its exact alias branch before adding it to grammar.inline. Preserve keyword options, aliases, caller fields and ordering against all competing rules; check other metadata and cross-file uses, then measure parser counts and bytes and compare complete CSTs.`,
        );
      }
    },
  };
}, "Suggest transferring rule precedence to a named branch before inlining private keyword aliases");
