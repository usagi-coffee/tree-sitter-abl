import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isStaticDsl,
  isStaticKeywordCall,
  memberName,
  referencedSymbols,
  ruleName,
} from "../helpers.js";
import { projectPrecedenceSymbols, rootMetadataSymbols } from "./project-metadata.js";

export function isFixedKeywordFieldBranch(context, property, use, properties, references) {
  const name = ruleName(property),
    body = property.value.body,
    owner = enclosingRule(use);
  const compoundSuffix = body.arguments.length === 6;
  const suffixBranch = body.arguments.length === 4 || compoundSuffix;
  const caller = use.parent;
  const alternatives = suffixBranch ? caller.parent : caller;
  if (
    property.computed ||
    owner.computed ||
    property.parent.properties.some((entry) => entry.type === "SpreadElement") ||
    callName(alternatives) !== "choice" ||
    alternatives.arguments.length < 2 ||
    !isStaticDsl(body)
  )
    return false;
  const keyword = (node) => memberName(node)?.startsWith("_kw_") || isStaticKeywordCall(node);
  const valueField = (node, value = memberName) =>
    callName(node) === "field" &&
    node.arguments.length === 2 &&
    node.arguments[0].type === "Literal" &&
    typeof node.arguments[0].value === "string" &&
    node.arguments[0].value.length > 0 &&
    value(node.arguments[1]);
  const keywordAlias = (node) => {
    if (callName(node) !== "alias" || node.arguments.length !== 2 || !keyword(node.arguments[0]))
      return null;
    const target = memberName(node.arguments[1]);
    return target && !target.startsWith("_") ? target : null;
  };
  const requiredBranch = () => {
    const [first, source, second, third, target] = body.arguments;
    return (
      body.arguments.length === 5 &&
      keyword(first) &&
      valueField(source) &&
      keyword(second) &&
      keyword(third) &&
      valueField(target) &&
      source.arguments[0].value !== target.arguments[0].value
    );
  };
  const qualifiedBranch = () => {
    const [first, second, source, relation, modifier, target, flag] = body.arguments;
    if (
      body.arguments.length !== 7 ||
      !keyword(first) ||
      !keyword(second) ||
      !valueField(source) ||
      !keyword(relation) ||
      callName(modifier) !== "optional" ||
      modifier.arguments.length !== 1 ||
      !valueField(modifier.arguments[0], keyword) ||
      !valueField(target) ||
      callName(flag) !== "optional" ||
      flag.arguments.length !== 1
    )
      return false;
    return (
      keywordAlias(flag.arguments[0]) &&
      new Set([
        source.arguments[0].value,
        modifier.arguments[0].arguments[0].value,
        target.arguments[0].value,
      ]).size === 3
    );
  };
  const requiredSuffix = () => {
    if (callName(caller) !== "seq" || caller.arguments.length !== 2 || caller.arguments[1] !== use)
      return false;
    const [action] = caller.arguments;
    if (compoundSuffix) {
      const [source, phrase, firstMarker, firstValue, secondMarker, secondValue] = body.arguments;
      const phraseName = memberName(phrase);
      const keywordName = (node) =>
        (isStaticKeywordCall(node)
          ? node.arguments[0].value
          : memberName(node).slice(4).replaceAll("_", "-")
        ).toUpperCase();
      return (
        valueField(action, keywordAlias) &&
        valueField(source) &&
        phraseName?.startsWith("_") &&
        !phraseName.startsWith("__") &&
        phraseName.endsWith("_phrase") &&
        keyword(firstMarker) &&
        keyword(secondMarker) &&
        keywordName(firstMarker) !== keywordName(secondMarker) &&
        valueField(firstValue) &&
        valueField(secondValue) &&
        new Set([action, source, firstValue, secondValue].map((field) => field.arguments[0].value))
          .size === 4
      );
    }
    const [source, marker, target, tail] = body.arguments;
    const aliasChoice = (node) => {
      if (callName(node) !== "choice" || node.arguments.length < 2) return false;
      const aliasName = keywordAlias(node.arguments[0]);
      return (
        aliasName && node.arguments.every((alternative) => keywordAlias(alternative) === aliasName)
      );
    };
    if (
      !valueField(action, aliasChoice) ||
      !valueField(source) ||
      !keyword(marker) ||
      !valueField(target) ||
      new Set([action, source, target].map((field) => field.arguments[0].value)).size !== 3
    )
      return false;
    const tailName = memberName(tail);
    if (!tailName?.startsWith("__") || !definition(tailName)) return false;
    return (references.get(tailName) ?? []).some((reference) => enclosingRule(reference) === owner);
  };
  const definition = (symbol) =>
    properties.find((other) => other.parent === property.parent && ruleName(other) === symbol);
  if (!requiredBranch() && !qualifiedBranch() && !requiredSuffix()) return false;
  const suppressed = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" && node.arguments.some(suppressed));
  if (suppressed(body) || isRuleDisabled(context, owner) || (suffixBranch && suppressed(caller)))
    return false;
  for (let current = use; current !== owner; current = current.parent) {
    if (
      isRuleDisabled(context, current) ||
      (current.type === "CallExpression" &&
        (![
          "seq",
          "choice",
          "optional",
          "repeat",
          "repeat1",
          "prec",
          "prec.left",
          "prec.right",
        ].includes(callName(current)) ||
          !isStaticDsl(current)))
    )
      return false;
  }
  const restricted = rootMetadataSymbols(context, [
    "inline",
    "conflicts",
    "precedences",
    "supertypes",
    "externals",
    "extras",
    "word",
  ]);
  for (const symbol of projectPrecedenceSymbols(context)) restricted.add(symbol);
  if (restricted.has(name) || restricted.has(ruleName(owner))) return false;
  const recursive = (symbol, seen = new Set()) => {
    if (symbol === name) return true;
    if (seen.has(symbol)) return false;
    seen.add(symbol);
    const dependency = definition(symbol);
    return dependency
      ? !isStaticDsl(dependency.value.body) ||
          referencedSymbols(dependency.value.body).some((next) => recursive(next, seen))
      : false;
  };
  return !referencedSymbols(body).some((symbol) => recursive(symbol));
}
