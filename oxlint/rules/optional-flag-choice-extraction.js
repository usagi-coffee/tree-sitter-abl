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

export const optionalFlagChoiceExtraction = rule((context) => {
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
  const signature = (node) =>
    JSON.stringify(context.sourceCode.getTokens(node).map(({ type, value }) => [type, value]));
  const namedFlag = (node) => {
    if (callName(node) !== "alias" || node.arguments.length !== 2) return false;
    const [source, target] = node.arguments,
      name = memberName(target);
    return (
      name &&
      !name.startsWith("_") &&
      (isStaticKeywordCall(source) || memberName(source)?.startsWith("_kw_"))
    );
  };
  const disabled = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" && node.arguments.some(disabled));
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
          disabled(body)
        )
          continue;
        const [prefix, tail] = body.arguments;
        if (
          callName(prefix) !== "optional" ||
          prefix.arguments.length !== 1 ||
          !namedFlag(prefix.arguments[0]) ||
          callName(tail) !== "choice" ||
          tail.arguments.length !== 2
        )
          continue;
        const [branch, fallback] = tail.arguments;
        if (
          callName(branch) !== "seq" ||
          branch.arguments.length !== 2 ||
          !namedFlag(branch.arguments[0]) ||
          !namedFlag(fallback)
        )
          continue;
        const suffix = branch.arguments[1];
        if (
          callName(suffix) !== "optional" ||
          suffix.arguments.length !== 1 ||
          signature(suffix.arguments[0]) !== signature(fallback) ||
          new Set([prefix.arguments[0], branch.arguments[0], fallback].map(signature)).size !== 3
        )
          continue;
        const uses = references.get(name) ?? [];
        if (
          uses.length < 2 ||
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
              if (isRuleDisabled(context, parent)) return false;
            }
            return true;
          })
        )
          continue;
        report(
          context,
          tail,
          "optional-flag-choice-extraction",
          `${name} combines an optional flag prefix with a required choice of ordered flags at ${uses.length} local uses; try extracting the complete nonempty choice into a hidden helper, leaving the prefix optional at its current scope. Preserve every alias, keyword option, alternative and suffix order; check external uses and metadata, prioritize LARGE_STATE_COUNT before ACTION_COUNT, and compare complete valid and recovery trees.`,
        );
      }
    },
  };
}, "Suggest extracting required ordered flag choices after optional prefixes in reused private helpers");
