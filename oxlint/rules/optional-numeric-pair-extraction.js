import {
  callName,
  dslSignature,
  isRuleDisabled,
  isRuleProperty,
  isStaticKeywordCall,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { projectPrecedenceSymbols, rootMetadataSymbols } from "../helpers/project-metadata.js";

function isKeyword(node) {
  return isStaticKeywordCall(node) || memberName(node)?.startsWith("_kw_");
}

function isOptionalTail(node) {
  if (callName(node) !== "optional" || node.arguments.length !== 1) return false;
  const [suffix] = node.arguments;
  return (
    memberName(suffix) !== null ||
    (callName(suffix) === "choice" &&
      suffix.arguments.length > 1 &&
      suffix.arguments.every(isKeyword))
  );
}

function numericPairs(branch) {
  if (callName(branch) !== "seq" || branch.arguments.length !== 4) return null;
  const [firstKeyword, firstField, secondKeyword, secondField] = branch.arguments;
  const pairs = [
    [firstKeyword, firstField],
    [secondKeyword, secondField],
  ];
  if (
    !pairs.every(
      ([keyword, field]) =>
        isStaticKeywordCall(keyword) &&
        keyword.arguments.length === 1 &&
        /^[A-Z][A-Z0-9-]*$/.test(keyword.arguments[0].value) &&
        callName(field) === "field" &&
        field.arguments.length === 2 &&
        field.arguments[0].type === "Literal" &&
        typeof field.arguments[0].value === "string" &&
        field.arguments[0].value !== "" &&
        memberName(field.arguments[1]) === "number_literal",
    ) ||
    firstKeyword.arguments[0].value === secondKeyword.arguments[0].value ||
    firstField.arguments[0].value === secondField.arguments[0].value
  )
    return null;
  return pairs.map((pair) => pair.map(dslSignature).join(" "));
}

export const optionalNumericPairExtraction = rule((context) => {
  const disabled = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" && node.arguments.some(disabled));
  return {
    Property(owner) {
      if (!isRuleProperty(owner)) return;
      const name = ruleName(owner);
      const body = owner.value.body;
      if (name.startsWith("_") || !name.endsWith("_phrase") || callName(body) !== "seq") return;
      const [head, bounds, ...tails] = body.arguments;
      if (
        !isKeyword(head) ||
        callName(bounds) !== "optional" ||
        bounds.arguments.length !== 1 ||
        tails.length === 0 ||
        !tails.every(isOptionalTail)
      )
        return;
      const [choice] = bounds.arguments;
      if (callName(choice) !== "choice" || choice.arguments.length !== 2) return;
      const [forward, reverse] = choice.arguments.map(numericPairs);
      if (!forward || !reverse || forward[0] !== reverse[1] || forward[1] !== reverse[0]) return;
      if (isRuleDisabled(context, owner) || disabled(body)) return;

      const restricted = rootMetadataSymbols(context, [
        "inline",
        "conflicts",
        "precedences",
        "supertypes",
        "externals",
        "extras",
        "word",
      ]);
      if (restricted.has(name) || projectPrecedenceSymbols(context).has(name)) return;
      report(
        context,
        bounds,
        "optional-numeric-pair-extraction",
        "This optional choice accepts two required keyword and numeric-field pairs in either order. Try moving both alternatives into a hidden rule and keeping the optional at the call site. Preserve token identity, fields and branch order, then compare parser metrics, parsing speed and complete valid and recovery trees.",
      );
    },
  };
}, "Suggest extracting an optional choice of numeric-field pairs in either order");
