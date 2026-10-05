import {
  callName,
  collectRules,
  isRuleDisabled,
  isStaticDsl,
  isStaticKeywordCall,
  memberName,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const optionalFlagMarkerPrefix = rule(
  collectRules((context, properties) => {
    const keywordAlias = (node) =>
      callName(node) === "alias" &&
      node.arguments.length === 2 &&
      (isStaticKeywordCall(node.arguments[0]) ||
        memberName(node.arguments[0])?.startsWith("_kw_")) &&
      memberName(node.arguments[1]) &&
      !memberName(node.arguments[1]).startsWith("_");
    for (const property of properties) {
      let sequence = property.value.body;
      while (["prec", "prec.left", "prec.right"].includes(callName(sequence)))
        sequence = sequence.arguments.at(-1);
      const elements = callName(sequence) === "seq" ? sequence.arguments : null;
      if (
        !elements ||
        elements.length < 4 ||
        !isStaticDsl(property.value.body) ||
        memberName(elements.at(-1)) !== "_kw_end" ||
        isRuleDisabled(context, property) ||
        isRuleDisabled(context, sequence)
      )
        continue;
      const [flag, marker, delimiter] = elements;
      if (
        callName(flag) !== "optional" ||
        flag.arguments.length !== 1 ||
        !keywordAlias(flag.arguments[0]) ||
        !memberName(marker)?.startsWith("__") ||
        callName(delimiter) !== "alias" ||
        delimiter.arguments.length !== 2 ||
        memberName(delimiter.arguments[0]) !== "_colon" ||
        delimiter.arguments[1].type !== "Literal" ||
        delimiter.arguments[1].value !== ":" ||
        [flag, marker, delimiter].some((part) => isRuleDisabled(context, part))
      )
        continue;
      const definition = properties.find(
        (other) => other.parent === property.parent && ruleName(other) === memberName(marker),
      );
      if (
        !definition ||
        definition === property ||
        !keywordAlias(definition.value.body) ||
        isRuleDisabled(context, definition) ||
        referencedSymbols(flag).includes(ruleName(property))
      )
        continue;
      report(
        context,
        property,
        "optional-flag-marker-prefix",
        `${ruleName(property)} starts an END-closed block with an optional keyword flag and required ${memberName(marker)} keyword alias before a colon; try extracting only the flag and marker into a non-empty hidden prefix. Keep the colon at its original caller to preserve missing-delimiter recovery, retain every alias, keyword option, field scope and closing tail, check metadata, then measure parser counts and bytes and compare complete valid and error trees and node-schema required flags.`,
      );
    }
  }),
  "Suggest extracting optional keyword flags with required block markers while retaining delimiters",
);
