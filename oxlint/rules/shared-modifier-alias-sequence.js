import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isStaticDsl,
  isStaticKeywordCall,
  memberName,
  report,
  rule,
  ruleName,
  unwrap,
} from "../helpers.js";
import { projectPrecedenceSymbols, rootMetadataSymbols } from "../helpers/project-metadata.js";
import { sharedModifierAliasSequences } from "../sharing-state.js";

export const sharedModifierAliasSequence = rule((context) => {
  const candidates = [],
    restricted = rootMetadataSymbols(context, ["inline", "externals", "supertypes", "word"]);
  for (const name of projectPrecedenceSymbols(context)) restricted.add(name);
  const modifierAlias = (node) => {
    if (callName(node) !== "alias" || node.arguments.length !== 2) return null;
    const [keyword, target] = node.arguments,
      name = memberName(target);
    if (!name || name.startsWith("_") || !name.endsWith("_modifier")) return null;
    if (!memberName(keyword)?.startsWith("_kw_") && !isStaticKeywordCall(keyword)) return null;
    return name;
  };
  return {
    CallExpression(node) {
      if (callName(node) !== "seq" || node.arguments.length !== 3 || !isStaticDsl(node)) return;
      const owner = enclosingRule(node),
        name = owner && ruleName(owner);
      if (!name?.startsWith("_") || !name.endsWith("_modifier") || restricted.has(name)) return;
      const alternatives = unwrap(owner.value.body);
      if (callName(alternatives) !== "choice" || node.parent !== alternatives) return;
      if (isRuleDisabled(context, owner) || isRuleDisabled(context, node)) return;
      for (let parent = node.parent; parent !== owner; parent = parent.parent) {
        if (
          ["alias", "field", "token", "token.immediate", "prec.dynamic"].includes(callName(parent))
        )
          return;
      }
      const [head, middle, tail] = node.arguments;
      if (callName(middle) !== "optional" || middle.arguments.length !== 1) return;
      const headAlias = modifierAlias(head),
        middleAlias = modifierAlias(middle.arguments[0]),
        tailAlias = modifierAlias(tail);
      if (!headAlias || !middleAlias || middleAlias !== tailAlias || headAlias === tailAlias)
        return;
      if ([head, middle, middle.arguments[0], tail].some((part) => isRuleDisabled(context, part)))
        return;
      candidates.push({ node, owner });
    },
    "Program:exit"() {
      for (const { node, owner } of candidates) {
        const candidate = {
          cwd: context.cwd,
          filename: context.filename,
          owner: ruleName(owner),
          signature: JSON.stringify(
            context.sourceCode.getTokens(node).map(({ type, value }) => [type, value]),
          ),
        };
        const previous = sharedModifierAliasSequences.find(
          (other) =>
            other.cwd === candidate.cwd &&
            other.signature === candidate.signature &&
            (other.filename !== candidate.filename || other.owner !== candidate.owner),
        );
        if (previous)
          report(
            context,
            node,
            "shared-modifier-alias-sequence",
            `${candidate.owner} repeats the required/optional/required keyword-alias sequence in ${previous.owner} (${previous.filename}); try sharing this exact non-empty modifier clause in a measured subset of callers. Preserve alias targets, keyword options, order and the outer modifier conflict symbols. Keep an expanded caller where needed for missing-prefix recovery, then compare parser counts, complete valid and error trees, and node-schema required flags before keeping the change.`,
          );
        else sharedModifierAliasSequences.push(candidate);
      }
    },
  };
}, "Suggest measured sharing of exact keyword-alias clauses in modifier families");
