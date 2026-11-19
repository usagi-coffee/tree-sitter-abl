import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  isSmallSequenceElement,
  isStaticDsl,
  isStaticKeywordCall,
  memberName,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";

import { projectPrecedenceSymbols, rootMetadataSymbols } from "../helpers/project-metadata.js";

function isCompoundBodyChoiceArm(context, property, use, owner, properties, references) {
  const body = property.value.body;
  const [opener, statements] = body.arguments;
  const arm = use.parent;
  const alternatives = owner.value.body;
  const ownerName = ruleName(owner);
  if (
    body.arguments.length !== 2 ||
    callName(opener) !== "alias" ||
    opener.arguments.length !== 2 ||
    memberName(opener.arguments[0]) !== "_colon" ||
    opener.arguments[1].type !== "Literal" ||
    opener.arguments[1].value !== ":" ||
    memberName(statements) !== "_compound_body" ||
    !ownerName.startsWith("__") ||
    property.parent.properties.some((entry) => entry.type === "SpreadElement" || entry.computed) ||
    callName(arm) !== "seq" ||
    arm.arguments.length !== 3 ||
    arm.arguments[0] !== use ||
    memberName(arm.arguments[2]) !== "_terminator" ||
    callName(alternatives) !== "choice" ||
    alternatives.arguments.length !== 2 ||
    !alternatives.arguments.includes(arm) ||
    !alternatives.arguments.some((alternative) => memberName(alternative) === "_terminator_dot")
  )
    return false;

  const end = arm.arguments[1];
  if (callName(end) !== "optional" || end.arguments.length !== 1) return false;
  const keywords = end.arguments[0];
  if (
    callName(keywords) !== "choice" ||
    keywords.arguments.length !== 2 ||
    !keywords.arguments.every((keyword) => memberName(keyword)?.startsWith("_kw_"))
  )
    return false;

  const suppressed = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" && node.arguments.some(suppressed));
  if (isRuleDisabled(context, owner) || suppressed(alternatives) || suppressed(body)) return false;

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
    restricted.has(ownerName) ||
    (references.get(ownerName) ?? []).some((reference) => !enclosingRule(reference))
  )
    return false;

  const seen = new Set();
  const recursive = (symbol) => {
    if (symbol === name || symbol === ownerName) return true;
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

export const singleUseAliasSequence = rule((context) => {
  const properties = [];
  const references = new Map();
  let dynamicReference = false;
  const symbolAlias = (node) => {
    if (callName(node) !== "alias" || node.arguments.length !== 2) return false;
    const source = memberName(node.arguments[0]);
    const target = node.arguments[1];
    if (!source || source.endsWith("_keyword")) return false;
    const destination = memberName(target);
    return destination
      ? !destination.startsWith("_") && destination !== source
      : target.type === "Literal" && typeof target.value === "string";
  };
  const smallElement = (node) => {
    if (isSmallSequenceElement(node) || isStaticKeywordCall(node) || symbolAlias(node)) return true;
    if (callName(node) === "field" && node.arguments.length === 2)
      return smallElement(node.arguments[1]);
    if (callName(node) === "optional" && node.arguments.length === 1)
      return smallElement(node.arguments[0]);
    return false;
  };
  const hasAlias = (node) => {
    if (symbolAlias(node)) return true;
    if (callName(node) === "field") return hasAlias(node.arguments[1]);
    if (callName(node) === "optional") return hasAlias(node.arguments[0]);
    return false;
  };
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      const name =
        memberName(node) ??
        (node.computed &&
        node.object.type === "Identifier" &&
        node.object.name === "$" &&
        node.property.type === "Literal" &&
        typeof node.property.value === "string"
          ? node.property.value
          : null);
      if (!name) {
        if (node.computed && node.object.type === "Identifier" && node.object.name === "$")
          dynamicReference = true;
        return;
      }
      if (!references.has(name)) references.set(name, []);
      references.get(name).push(node);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property);
        const body = property.value.body;
        if (!name.startsWith("__")) continue;
        if (isRuleDisabled(context, property) || !isStaticDsl(body)) continue;
        if (callName(body) !== "seq" || body.arguments.length < 2 || body.arguments.length > 3)
          continue;
        if (!body.arguments.every(smallElement) || !body.arguments.some(hasAlias)) continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const use = uses[0];
        const owner = enclosingRule(use);
        if (
          memberName(use) !== name ||
          !owner ||
          owner === property ||
          owner.parent !== property.parent
        )
          continue;
        const compoundBody = name.endsWith("_body");
        if (
          compoundBody &&
          (dynamicReference ||
            !isCompoundBodyChoiceArm(context, property, use, owner, properties, references))
        )
          continue;
        let unsafe = false;
        for (let parent = use.parent; parent !== owner; parent = parent.parent) {
          if (
            ["alias", "field", "token", "token.immediate", "prec.dynamic"].includes(
              callName(parent),
            )
          )
            unsafe = true;
        }
        if (unsafe) continue;
        report(
          context,
          property,
          "single-use-alias-sequence",
          compoundBody
            ? `${name} starts one unaliased choice-arm sequence in ${ruleName(owner)}; try inlining the aliased colon and compound statement list while retaining the closing keywords, terminator and choice order. Check external references and grammar metadata, then compare parser metrics, parsing speed and complete valid and recovery trees.`
            : `${name} has one unaliased local use in ${ruleName(owner)}; try inlining this small sequence with its symbol aliases intact. Preserve alias targets, fields and precedence, check external references and grammar metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest inlining single-use private sequences containing symbol aliases");
