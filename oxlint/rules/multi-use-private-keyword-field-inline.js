import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  isStaticKeywordCall,
  memberName,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { projectPrecedenceSymbols, rootMetadataSymbols } from "../helpers/project-metadata.js";

export const multiUsePrivateKeywordFieldInline = rule((context) => {
  const properties = [],
    references = new Map(),
    restricted = rootMetadataSymbols(context, ["inline", "conflicts", "supertypes", "externals"]);
  for (const name of projectPrecedenceSymbols(context)) restricted.add(name);
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
      if (!name) return;
      const uses = references.get(name) ?? [];
      uses.push(node);
      references.set(name, uses);
      if (!enclosingRule(node)) restricted.add(name);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (!name.startsWith("__") || restricted.has(name) || isRuleDisabled(context, property))
          continue;
        if (callName(body) !== "seq" || body.arguments.length !== 2) continue;
        const [keyword, value] = body.arguments;
        if (!isStaticKeywordCall(keyword) && !memberName(keyword)?.startsWith("_kw_")) continue;
        if (
          callName(value) !== "field" ||
          value.arguments.length !== 2 ||
          value.arguments[0].type !== "Literal" ||
          typeof value.arguments[0].value !== "string" ||
          !memberName(value.arguments[1]) ||
          referencedSymbols(body).includes(name)
        )
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length < 2) continue;
        if (
          !uses.every((use) => {
            const owner = enclosingRule(use);
            if (use.computed || !owner || owner === property || owner.parent !== property.parent)
              return false;
            for (let parent = use.parent; parent !== owner; parent = parent.parent) {
              if (
                parent.type === "CallExpression" &&
                ![
                  "seq",
                  "choice",
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
          })
        )
          continue;
        report(
          context,
          property,
          "multi-use-private-keyword-field-inline",
          `${name} has ${uses.length} unaliased local uses of a private keyword-plus-field sequence; try adding it to grammar.inline. Check cross-file uses and metadata, preserve keyword identity and field scope, then measure parser counts and bytes and validate complete trees.`,
        );
      }
    },
  };
}, "Suggest metadata inlining of multiply used private keyword-plus-field sequences");
