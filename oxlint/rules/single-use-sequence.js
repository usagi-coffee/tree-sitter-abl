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
import {
  projectPrecedenceSymbols,
  rootMetadataSymbols,
  usedOutsideFile,
} from "../helpers/project-metadata.js";

const optionalValue = (node) =>
  callName(node) === "optional" && node.arguments.length === 1 ? node.arguments[0] : null;
const keyword = (node) => memberName(node)?.startsWith("_kw_") || isStaticKeywordCall(node);

function isOptionalSelectorChoiceArm(context, property, use, owner, properties, references) {
  const name = ruleName(property);
  const ownerName = ruleName(owner);
  const prefix = owner.value.body;
  const body = property.value.body;
  const choice = use.parent;
  if (
    !ownerName.startsWith("__") ||
    !ownerName.endsWith("_prefix") ||
    property.parent.properties.some((entry) => entry.type === "SpreadElement" || entry.computed) ||
    callName(prefix) !== "seq" ||
    prefix.arguments.length !== 2 ||
    !keyword(prefix.arguments[0]) ||
    optionalValue(prefix.arguments[1]) !== choice ||
    callName(choice) !== "choice" ||
    choice.arguments.length < 2 ||
    !choice.arguments.includes(use) ||
    !isStaticDsl(prefix) ||
    body.arguments.length !== 4 ||
    !isStaticDsl(body)
  )
    return false;

  const [head, selector, group, tail] = body.arguments;
  const marker = optionalValue(head);
  const selectorName = memberName(selector);
  const groupName = memberName(group);
  const tailName = memberName(optionalValue(tail));
  if (
    !keyword(marker) ||
    !selectorName?.startsWith("_") ||
    selectorName.startsWith("__") ||
    !selectorName.endsWith("_selector") ||
    !groupName?.startsWith("__") ||
    !tailName?.startsWith("__") ||
    groupName === tailName
  )
    return false;

  const localRules = new Map(
    properties
      .filter((other) => other.parent === property.parent)
      .map((other) => [ruleName(other), other.value.body]),
  );
  if (!localRules.has(groupName)) return false;
  const continuation = localRules.get(tailName);
  const continuationSequence =
    callName(continuation) === "prec.right" && continuation.arguments.length === 1
      ? continuation.arguments[0]
      : continuation;
  if (callName(continuationSequence) !== "seq" || continuationSequence.arguments.length !== 4)
    return false;
  const [again, nextSelector, nextGroup, nextTail] = continuationSequence.arguments;
  if (
    !keyword(again) ||
    context.sourceCode.getText(marker) !== context.sourceCode.getText(again) ||
    memberName(nextSelector) !== selectorName ||
    memberName(nextGroup) !== groupName ||
    memberName(optionalValue(nextTail)) !== tailName
  )
    return false;

  const suppressed = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" && node.arguments.some(suppressed));
  if (
    isRuleDisabled(context, property) ||
    isRuleDisabled(context, owner) ||
    suppressed(prefix) ||
    suppressed(body)
  )
    return false;

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
  const recursive = (symbol) => {
    if (symbol === name || symbol === ownerName) return true;
    if (seen.has(symbol)) return false;
    seen.add(symbol);
    const dependency = localRules.get(symbol);
    return (
      dependency && (!isStaticDsl(dependency) || referencedSymbols(dependency).some(recursive))
    );
  };
  return !referencedSymbols(body).some(recursive);
}

export const singleUseSequence = rule((context) => {
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
        if (!name.startsWith("__") || callName(body) !== "seq") continue;
        const selectorBody = name.endsWith("_body");
        if (
          selectorBody
            ? body.arguments.length !== 4
            : body.arguments.length < 2 || body.arguments.length > 3
        )
          continue;
        if (!selectorBody && !body.arguments.every(isSmallSequenceElement)) continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const use = uses[0];
        const owner = enclosingRule(use);
        if (!owner || owner === property || owner.parent !== property.parent) continue;
        if (
          selectorBody &&
          (dynamicReference ||
            !isOptionalSelectorChoiceArm(context, property, use, owner, properties, references))
        )
          continue;
        if (["alias", "field"].includes(callName(use.parent))) continue;
        let lexical = false;
        for (
          let ancestor = use.parent;
          ancestor && ancestor !== owner;
          ancestor = ancestor.parent
        ) {
          if (["token", "token.immediate"].includes(callName(ancestor))) lexical = true;
        }
        if (lexical) continue;
        report(
          context,
          property,
          "single-use-sequence",
          selectorBody
            ? `${name} has one unaliased choice-arm use in ${ruleName(owner)}; try inlining the optional marker, shared selector, field group and recursive continuation inside the existing optional choice. Preserve field scope, keyword tokens and branch order, then compare parser metrics, parsing speed and complete valid and recovery trees.`
            : `${name} has one unaliased local use in ${ruleName(owner)}; try inlining this small sequence. Check external references, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest measuring inlining of small, locally single-use private sequences");
