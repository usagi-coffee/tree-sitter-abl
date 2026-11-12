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

export function isFixedKeywordFieldBranch(context, property, use, properties) {
  const name = ruleName(property),
    body = property.value.body,
    owner = enclosingRule(use);
  if (
    property.computed ||
    owner.computed ||
    property.parent.properties.some((entry) => entry.type === "SpreadElement") ||
    callName(use.parent) !== "choice" ||
    use.parent.arguments.length < 2 ||
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
    const alias = flag.arguments[0],
      visible = callName(alias) === "alias" && memberName(alias.arguments[1]);
    return (
      alias.arguments?.length === 2 &&
      keyword(alias.arguments[0]) &&
      visible &&
      !visible.startsWith("_") &&
      new Set([
        source.arguments[0].value,
        modifier.arguments[0].arguments[0].value,
        target.arguments[0].value,
      ]).size === 3
    );
  };
  if (!requiredBranch() && !qualifiedBranch()) return false;
  const suppressed = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" && node.arguments.some(suppressed));
  if (suppressed(body) || isRuleDisabled(context, owner)) return false;
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
    const definition = properties.find(
      (other) => other.parent === property.parent && ruleName(other) === symbol,
    );
    return definition
      ? !isStaticDsl(definition.value.body) ||
          referencedSymbols(definition.value.body).some((next) => recursive(next, seen))
      : false;
  };
  return !referencedSymbols(body).some((symbol) => recursive(symbol));
}
