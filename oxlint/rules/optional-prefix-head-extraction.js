import {
  callName,
  dslSignature,
  enclosingRule,
  isNullable,
  isRuleDisabled,
  isStaticDsl,
  isStaticKeywordCall,
  memberName,
  report,
  rule,
} from "../helpers.js";

export const optionalPrefixHeadExtraction = rule((context) => {
  const keyword = (node) => memberName(node)?.startsWith("_kw_") || isStaticKeywordCall(node);
  return {
    CallExpression(node) {
      if (callName(node) !== "choice" || node.arguments.length < 2 || node.arguments.length > 8)
        return;
      const owner = enclosingRule(node);
      if (
        !owner ||
        !isStaticDsl(node) ||
        isRuleDisabled(context, owner) ||
        isRuleDisabled(context, node)
      )
        return;
      for (let parent = node.parent; parent !== owner; parent = parent.parent) {
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
          return;
      }
      const branches = node.arguments;
      if (!branches.every((branch) => callName(branch) === "seq" && branch.arguments.length >= 4))
        return;
      const [prefix, marker, ...suffix] = branches[0].arguments;
      if (
        callName(prefix) !== "optional" ||
        prefix.arguments.length !== 1 ||
        !memberName(prefix.arguments[0]) ||
        !keyword(marker) ||
        suffix.every((part) => isNullable(part))
      )
        return;
      const markers = new Set();
      for (const branch of branches) {
        const [otherPrefix, otherMarker, ...otherSuffix] = branch.arguments;
        if (
          branch.arguments.length !== branches[0].arguments.length ||
          dslSignature(otherPrefix) !== dslSignature(prefix) ||
          !keyword(otherMarker) ||
          markers.has(dslSignature(otherMarker)) ||
          otherSuffix.some((part, index) => dslSignature(part) !== dslSignature(suffix[index])) ||
          isRuleDisabled(context, branch)
        )
          return;
        markers.add(dslSignature(otherMarker));
      }
      report(
        context,
        node,
        "optional-prefix-head-extraction",
        "These alternatives share an optional prefix and compound suffix around distinct keywords; try combining the optional prefix and ordered keyword choice in a non-empty hidden header, retaining the suffix outside. Preserve field scopes, aliases, token identity and precedence, check keyword overlap, then measure parser counts and bytes and compare complete trees.",
      );
    },
  };
}, "Suggest sharing optional prefixes and differing keywords through hidden headers");
