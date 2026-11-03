import {
  callName,
  dslSignature,
  enclosingRule,
  isRuleDisabled,
  isStaticDsl,
  isStaticKeywordCall,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { projectPrecedenceSymbols, rootMetadataSymbols } from "../helpers/project-metadata.js";

export const optionalFlagPairExtraction = rule((context) => {
  const sequences = [],
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
  const keyword = (node) => memberName(node)?.startsWith("_kw_") || isStaticKeywordCall(node);
  const disabled = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" && node.arguments.some(disabled));
  const flagAlias = (node) => {
    if (callName(node) !== "optional" || node.arguments.length !== 1) return null;
    const alias = node.arguments[0];
    if (callName(alias) !== "alias" || alias.arguments.length !== 2) return null;
    const target = memberName(alias.arguments[1]);
    return target && !target.startsWith("_") ? alias : null;
  };
  return {
    CallExpression(node) {
      if (callName(node) === "seq") sequences.push(node);
    },
    MemberExpression(node) {
      if (node.object.type !== "Identifier" || node.object.name !== "$") return;
      const name = memberName(node);
      if (!name) {
        dynamicReference = true;
        return;
      }
      const owner = enclosingRule(node);
      if (!owner) restricted.add(name);
      for (let parent = node.parent; parent && parent !== owner; parent = parent.parent) {
        if (["alias", "token", "token.immediate", "prec.dynamic"].includes(callName(parent)))
          restricted.add(name);
      }
    },
    "Program:exit"() {
      if (dynamicReference) return;
      for (const sequence of sequences) {
        const owner = enclosingRule(sequence);
        if (
          !owner ||
          restricted.has(ruleName(owner)) ||
          isRuleDisabled(context, owner) ||
          isRuleDisabled(context, sequence) ||
          !isStaticDsl(sequence)
        )
          continue;
        let unsafe = false;
        for (let parent = sequence.parent; parent !== owner; parent = parent.parent) {
          if (
            parent.type === "CallExpression" &&
            (![
              "seq",
              "choice",
              "optional",
              "repeat",
              "repeat1",
              "prec",
              "prec.left",
              "prec.right",
            ].includes(callName(parent)) ||
              !isStaticDsl(parent))
          )
            unsafe = true;
        }
        if (unsafe) continue;
        const parts = sequence.arguments;
        for (let index = 1; index + 3 < parts.length; index++) {
          const [value, first, second, marker] = parts.slice(index - 1, index + 3),
            familyAlias = flagAlias(first),
            singleAlias = flagAlias(second);
          if (
            callName(value) !== "field" ||
            value.arguments.length !== 2 ||
            value.arguments[0].type !== "Literal" ||
            typeof value.arguments[0].value !== "string" ||
            !memberName(value.arguments[1]) ||
            !familyAlias ||
            !singleAlias ||
            !keyword(marker) ||
            !keyword(singleAlias.arguments[0]) ||
            memberName(familyAlias.arguments[1]) === memberName(singleAlias.arguments[1]) ||
            [value, first, second, marker].some(disabled)
          )
            continue;
          const family = familyAlias.arguments[0];
          if (
            callName(family) !== "choice" ||
            family.arguments.length < 2 ||
            family.arguments.length > 8 ||
            !family.arguments.every(keyword)
          )
            continue;
          const signatures = family.arguments.map(dslSignature);
          if (
            new Set(signatures).size !== signatures.length ||
            signatures.includes(dslSignature(singleAlias.arguments[0]))
          )
            continue;
          report(
            context,
            first,
            "optional-flag-pair-extraction",
            "These adjacent optional flags accept a keyword family followed by one separate flag; try extracting only the ordered pair into an optional non-empty helper. Accept the family with its optional trailing flag, or the trailing flag alone. Keep the preceding field and following keyword at the caller to preserve recovery, retain aliases, token identities and order, then compare actions, table bytes, memory, parsing speed and complete valid and recovery trees before retaining the change.",
          );
        }
      }
    },
  };
}, "Suggest extracting ordered optional flag pairs before required keyword markers");
