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

export function isStructuredFieldChoiceBranch(context, property, use, properties, references) {
  const name = ruleName(property),
    body = property.value.body,
    owner = enclosingRule(use);
  if (
    property.computed ||
    owner.computed ||
    property.parent.properties.some((entry) => entry.type === "SpreadElement") ||
    callName(use.parent) !== "choice" ||
    use.parent.arguments.length < 2
  )
    return false;
  const keyword = (node) => memberName(node)?.startsWith("_kw_") || isStaticKeywordCall(node);
  const namedAlias = (node, source) =>
    callName(node) === "alias" &&
    node.arguments.length === 2 &&
    source(node.arguments[0]) &&
    memberName(node.arguments[1]) &&
    !memberName(node.arguments[1]).startsWith("_");
  const valueField = (node, value = memberName) =>
    callName(node) === "field" &&
    node.arguments.length === 2 &&
    node.arguments[0].type === "Literal" &&
    typeof node.arguments[0].value === "string" &&
    node.arguments[0].value.length > 0 &&
    value(node.arguments[1]);
  const actionChoice = (node) =>
    callName(node) === "choice" &&
    node.arguments.length >= 2 &&
    node.arguments.length <= 5 &&
    node.arguments.every((branch) => namedAlias(branch, keyword));
  const [action, target, selection, tail] = body.arguments;
  if (
    !valueField(action, actionChoice) ||
    !valueField(target) ||
    callName(selection) !== "choice" ||
    selection.arguments.length !== 2 ||
    !memberName(tail)?.startsWith("__")
  )
    return false;
  const [mode, valued] = selection.arguments;
  if (
    !valueField(mode, (node) =>
      namedAlias(node, (source) => memberName(source)?.startsWith("__")),
    ) ||
    callName(valued) !== "seq" ||
    valued.arguments.length !== 2 ||
    !keyword(valued.arguments[0]) ||
    !valueField(valued.arguments[1]) ||
    new Set([action, target, mode, valued.arguments[1]].map((field) => field.arguments[0].value))
      .size !== 4
  )
    return false;
  const definition = (symbol) =>
    properties.find((other) => other.parent === property.parent && ruleName(other) === symbol);
  const tailName = memberName(tail),
    tailRule = definition(tailName),
    tailBody = tailRule?.value.body,
    tailUses = references.get(tailName) ?? [];
  if (
    !tailRule ||
    tailRule.computed ||
    callName(tailBody) !== "seq" ||
    tailBody.arguments.length !== 3 ||
    !keyword(tailBody.arguments[0]) ||
    !valueField(tailBody.arguments[1]) ||
    callName(tailBody.arguments[2]) !== "optional" ||
    tailBody.arguments[2].arguments.length !== 1 ||
    !memberName(tailBody.arguments[2].arguments[0])?.startsWith("__") ||
    tailUses.length < 2 ||
    !tailUses.every((reference) => enclosingRule(reference)?.parent === property.parent)
  )
    return false;
  const suppressed = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" && node.arguments.some(suppressed));
  if (suppressed(body) || isRuleDisabled(context, tailRule) || suppressed(tailBody)) return false;
  for (let parent = use; parent !== owner; parent = parent.parent) {
    if (
      isRuleDisabled(context, parent) ||
      (parent.type === "CallExpression" &&
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
          !isStaticDsl(parent)))
    )
      return false;
  }
  if (isRuleDisabled(context, owner)) return false;
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
  if (restricted.has(name)) return false;
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
