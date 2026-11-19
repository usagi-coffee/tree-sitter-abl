import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  isStaticDsl,
  isStaticKeywordCall,
  memberName,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { projectPrecedenceSymbols, rootMetadataSymbols } from "../helpers/project-metadata.js";

function isOptionalKeywordSelector(context, property, use, owner, properties, references) {
  const prefixName = ruleName(owner);
  const prefix = owner.value.body;
  const optional = use.parent;
  const body = property.value.body;
  const keyword = (node) => memberName(node)?.startsWith("_kw_") || isStaticKeywordCall(node);
  if (
    !prefixName.startsWith("__") ||
    !prefixName.endsWith("_prefix") ||
    property.parent.properties.some((entry) => entry.type === "SpreadElement" || entry.computed) ||
    callName(prefix) !== "seq" ||
    prefix.arguments.length !== 2 ||
    !keyword(prefix.arguments[0]) ||
    prefix.arguments[1] !== optional ||
    callName(optional) !== "optional" ||
    optional.arguments.length !== 1 ||
    optional.arguments[0] !== use ||
    body.arguments.length !== 3
  )
    return false;

  const [field, clause, flag] = body.arguments;
  if (
    callName(field) !== "field" ||
    field.arguments.length !== 2 ||
    field.arguments[0].type !== "Literal" ||
    typeof field.arguments[0].value !== "string" ||
    !field.arguments[0].value ||
    !memberName(field.arguments[1]) ||
    !memberName(clause)?.startsWith("__") ||
    callName(flag) !== "alias" ||
    flag.arguments.length !== 2 ||
    !keyword(flag.arguments[0])
  )
    return false;
  const alias = memberName(flag.arguments[1]);
  if (!alias || alias.startsWith("_")) return false;

  const suppressed = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" && node.arguments.some(suppressed));
  if (isRuleDisabled(context, owner) || suppressed(prefix) || suppressed(body)) return false;

  const name = ruleName(property);
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
  if (
    restricted.has(name) ||
    restricted.has(prefixName) ||
    (references.get(prefixName) ?? []).some((reference) => !enclosingRule(reference))
  )
    return false;

  const seen = new Set();
  const recursive = (symbol) => {
    if (symbol === name || symbol === prefixName) return true;
    if (seen.has(symbol)) return false;
    seen.add(symbol);
    const dependency = properties.find(
      (other) => other.parent === property.parent && ruleName(other) === symbol,
    );
    return (
      dependency &&
      (!isStaticDsl(dependency.value.body) ||
        referencedSymbols(dependency.value.body).some(recursive))
    );
  };
  return !referencedSymbols(body).some(recursive);
}

export const singleUseChoice = rule((context) => {
  const properties = [];
  const references = new Map();
  let dynamicReference = false;
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      const name = memberName(node);
      if (!name) {
        if (node.computed && node.object.type === "Identifier" && node.object.name === "$")
          dynamicReference = true;
        return;
      }
      const uses = references.get(name) ?? [];
      uses.push(node);
      references.set(name, uses);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property);
        const body = property.value.body;
        if (!name.startsWith("__")) continue;
        if (
          callName(body) !== "choice" ||
          body.arguments.length < 2 ||
          body.arguments.length > 5 ||
          !isStaticDsl(body)
        )
          continue;
        if (isRuleDisabled(context, property)) continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const use = uses[0];
        const owner = enclosingRule(use);
        if (!owner || owner === property || owner.parent !== property.parent) continue;
        const optionalSelector = name.endsWith("_body");
        if (
          optionalSelector &&
          (dynamicReference ||
            !isOptionalKeywordSelector(context, property, use, owner, properties, references))
        )
          continue;
        let unsafe = false;
        for (let parent = use.parent; parent !== owner; parent = parent.parent) {
          if (["alias", "token", "token.immediate"].includes(callName(parent))) unsafe = true;
        }
        if (unsafe) continue;
        report(
          context,
          property,
          "single-use-choice",
          optionalSelector
            ? `${name} is the sole optional selector in the private keyword prefix ${ruleName(owner)}; try inlining the choice inside that optional while retaining the prefix, value field, clause reference, flag alias and alternative order. Check external references and grammar metadata, then compare parser metrics, parsing speed and complete valid and recovery trees.`
            : `${name} has one unaliased local use in ${ruleName(owner)}; try inlining this choice while preserving its alternatives, fields and precedence. Check external references and grammar metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest measuring inlining of small, locally single-use private choices");
