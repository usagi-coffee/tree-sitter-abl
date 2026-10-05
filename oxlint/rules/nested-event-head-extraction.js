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

export const nestedEventHeadExtraction = rule((context) => {
  const keyword = (node) => memberName(node)?.startsWith("_kw_") || isStaticKeywordCall(node);
  return {
    CallExpression(node) {
      if (callName(node) !== "choice" || node.arguments.length !== 2 || !isStaticDsl(node)) return;
      const owner = enclosingRule(node);
      if (!owner || isRuleDisabled(context, owner) || isRuleDisabled(context, node)) return;
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
      const [special, ordinary] = node.arguments;
      if (
        callName(special) !== "seq" ||
        special.arguments.length !== 3 ||
        callName(ordinary) !== "seq" ||
        ordinary.arguments.length !== 3
      )
        return;
      const [specialHead, specialMarker, specialTail] = special.arguments;
      const [ordinaryHead, ordinaryMarker, ordinaryTail] = ordinary.arguments;
      if (
        callName(specialHead) !== "field" ||
        specialHead.arguments.length !== 2 ||
        callName(ordinaryHead) !== "field" ||
        ordinaryHead.arguments.length !== 2 ||
        specialHead.arguments[0].type !== "Literal" ||
        typeof specialHead.arguments[0].value !== "string" ||
        dslSignature(specialHead.arguments[0]) !== dslSignature(ordinaryHead.arguments[0]) ||
        !keyword(specialHead.arguments[1]) ||
        !keyword(specialMarker) ||
        dslSignature(specialMarker) !== dslSignature(ordinaryMarker)
      )
        return;
      const alternatives = ordinaryHead.arguments[1];
      if (
        callName(alternatives) !== "choice" ||
        alternatives.arguments.length < 2 ||
        alternatives.arguments.length > 8 ||
        !alternatives.arguments.every(keyword)
      )
        return;
      const heads = [specialHead.arguments[1], ...alternatives.arguments].map(dslSignature);
      if (new Set(heads).size !== heads.length) return;
      if (
        callName(specialTail) !== "choice" ||
        specialTail.arguments.length !== 2 ||
        !memberName(ordinaryTail) ||
        dslSignature(specialTail.arguments[0]) !== dslSignature(ordinaryTail) ||
        callName(specialTail.arguments[1]) !== "seq" ||
        isNullable(specialTail.arguments[1])
      )
        return;
      report(
        context,
        node,
        "nested-event-head-extraction",
        "A field-wrapped keyword and a keyword family share a marker and action, but one nests an extra action branch; try combining the common-action keywords in a hidden head helper with the exact field and marker. Keep the special action separate and preserve its priority against the common action; verify keyword disjointness, field scopes, aliases and precedence, then measure parser counts and bytes and compare complete trees.",
      );
    },
  };
}, "Suggest extracting common event heads from nested action alternatives");
