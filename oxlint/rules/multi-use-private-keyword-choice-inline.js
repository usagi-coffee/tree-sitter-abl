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

export const multiUsePrivateKeywordChoiceInline = rule((context) => {
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
        if (
          callName(body) !== "choice" ||
          body.arguments.length < 2 ||
          body.arguments.length > 5 ||
          !isStaticDsl(body) ||
          isRuleDisabled(context, body)
        )
          continue;
        if (!body.arguments.some(isStaticKeywordCall)) continue;
        if (!body.arguments.some((branch) => memberName(branch)?.startsWith("_kw_"))) continue;
        if (
          !body.arguments.every(
            (branch) => isStaticKeywordCall(branch) || memberName(branch)?.startsWith("_kw_"),
          )
        )
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length < 2) continue;
        if (
          !uses.every((use) => {
            const owner = enclosingRule(use);
            if (
              use.computed ||
              !owner ||
              owner === property ||
              owner.parent !== property.parent ||
              isRuleDisabled(context, owner) ||
              isRuleDisabled(context, use)
            )
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
          })
        )
          continue;
        report(
          context,
          property,
          "multi-use-private-keyword-choice-inline",
          `${name} has ${uses.length} unaliased local uses of a private selector mixing keyword symbols and static keyword calls; try adding it to grammar.inline. Check cross-file uses and metadata, preserve keyword identity, abbreviation options, alternative order and caller fields, then compare action costs against state and byte savings and validate complete trees.`,
        );
      }
    },
  };
}, "Suggest metadata inlining of multiply used private selectors mixing keyword symbols and calls");
