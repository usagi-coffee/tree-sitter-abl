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
  const [action, target, selection] = body.arguments;
  if (!valueField(action, actionChoice) || !valueField(target)) return false;
  const optionalClause = body.arguments.length === 3,
    fields = [action, target];
  let tail;
  if (optionalClause) {
    if (callName(selection) !== "optional" || selection.arguments.length !== 1) return false;
    const clause = selection.arguments[0];
    if (callName(clause) !== "seq" || clause.arguments.length !== 3) return false;
    const [marker, value, suffix] = clause.arguments;
    if (
      !keyword(marker) ||
      !valueField(value) ||
      callName(suffix) !== "optional" ||
      suffix.arguments.length !== 1
    )
      return false;
    fields.push(value);
    tail = suffix.arguments[0];
  } else {
    if (
      body.arguments.length !== 4 ||
      callName(selection) !== "choice" ||
      selection.arguments.length !== 2
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
      !valueField(valued.arguments[1])
    )
      return false;
    fields.push(mode, valued.arguments[1]);
    tail = body.arguments[3];
  }
  if (
    !memberName(tail)?.startsWith("__") ||
    new Set(fields.map((field) => field.arguments[0].value)).size !== fields.length
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
    tailBody.arguments.length !== (optionalClause ? 2 : 3) ||
    !keyword(tailBody.arguments[0]) ||
    !valueField(tailBody.arguments[1]) ||
    (!optionalClause &&
      (callName(tailBody.arguments[2]) !== "optional" ||
        tailBody.arguments[2].arguments.length !== 1 ||
        !memberName(tailBody.arguments[2].arguments[0])?.startsWith("__"))) ||
    tailUses.length < 2 ||
    (optionalClause && !tailUses.some((reference) => enclosingRule(reference) !== property)) ||
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
  if (restricted.has(name) || (optionalClause && restricted.has(ruleName(owner)))) return false;
  if (
    optionalClause &&
    (references.get(ruleName(owner)) ?? []).some((reference) => !enclosingRule(reference))
  )
    return false;
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
