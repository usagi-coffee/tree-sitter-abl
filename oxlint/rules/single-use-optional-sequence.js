import {
  callName,
  enclosingRule,
  isNullable,
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

import {
  projectPrecedenceSymbols,
  rootMetadataSymbols,
  usedOutsideFile,
} from "../helpers/project-metadata.js";

const optionalValue = (node) =>
  callName(node) === "optional" && node.arguments.length === 1 ? node.arguments[0] : null;

function isOptionalListGroup(context, property, use, owner, properties, references) {
  const name = ruleName(property);
  const ownerName = ruleName(owner);
  const body = property.value.body;
  const caller = owner.value.body;
  if (
    !ownerName.startsWith("__") ||
    !ownerName.endsWith("_body") ||
    property.parent.properties.some((entry) => entry.type === "SpreadElement" || entry.computed) ||
    body.arguments.length !== 3 ||
    callName(caller) !== "seq" ||
    caller.arguments.length !== 2 ||
    optionalValue(caller.arguments[1]) !== use
  )
    return false;

  const prefixName = memberName(caller.arguments[0]);
  const [head, items, tail] = body.arguments;
  const phraseName = memberName(optionalValue(head));
  const listName = memberName(items);
  const tailName = memberName(optionalValue(tail));
  if (
    !prefixName?.startsWith("__") ||
    !phraseName?.endsWith("_phrase") ||
    phraseName.startsWith("_") ||
    !listName?.startsWith("_") ||
    listName.startsWith("__") ||
    !listName.endsWith("_list") ||
    !tailName?.startsWith("__")
  )
    return false;

  const localRules = new Map(
    properties
      .filter((other) => other.parent === property.parent)
      .map((other) => [ruleName(other), other.value.body]),
  );
  const prefix = localRules.get(prefixName);
  if (!prefix || isNullable(prefix) || !localRules.has(tailName)) return false;

  const suppressed = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" && node.arguments.some(suppressed));
  if (isRuleDisabled(context, owner) || suppressed(caller) || suppressed(body)) return false;

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
    (references.get(ownerName) ?? []).some((reference) => !enclosingRule(reference)) ||
    usedOutsideFile(context, name)
  )
    return false;

  const seen = new Set();
  const recursiveOrDynamic = (symbol) => {
    if (symbol === name || symbol === ownerName) return true;
    if (seen.has(symbol)) return false;
    seen.add(symbol);
    const dependency = localRules.get(symbol);
    return (
      dependency &&
      (!isStaticDsl(dependency) || referencedSymbols(dependency).some(recursiveOrDynamic))
    );
  };
  return ![prefixName, phraseName, listName, tailName].some(recursiveOrDynamic);
}

export const singleUseOptionalSequence = rule((context) => {
  const properties = [];
  const references = new Map();
  let dynamicReference = false;
  const smallElement = (node) => isSmallSequenceElement(node) || isStaticKeywordCall(node);
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
        const optionalListGroup = name.endsWith("_body");
        if (optionalListGroup) {
          if (
            dynamicReference ||
            !isOptionalListGroup(context, property, use, owner, properties, references)
          )
            continue;
        } else {
          const prefix = body.arguments.slice(0, -1);
          if (!prefix.every(smallElement) || prefix.every((element) => isNullable(element)))
            continue;
          const optionalTail = body.arguments.at(-1);
          if (callName(optionalTail) !== "optional" || optionalTail.arguments.length !== 1)
            continue;
          const tail = optionalTail.arguments[0];
          if (callName(tail) !== "seq" || tail.arguments.length < 2 || tail.arguments.length > 4)
            continue;
          if (!tail.arguments.every(smallElement)) continue;
        }
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
          "single-use-optional-sequence",
          optionalListGroup
            ? `${name} has one unaliased optional use at the end of ${ruleName(owner)}; try inlining the optional phrase, required shared list and optional private continuation into the existing optional wrapper. Retain the caller's prefix and sequence boundaries, then compare parser metrics, parsing speed and complete valid and recovery trees.`
            : `${name} has one unaliased local use in ${ruleName(owner)}; try inlining this small sequence with its optional compound suffix intact. Preserve fields and precedence, check external references and grammar metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest inlining single-use private sequences with optional elements");
