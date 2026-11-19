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

function isOptionalSelectorChoiceArm(context, body, use, owner, localRules) {
  const ownerName = ruleName(owner);
  const prefix = owner.value.body;
  const choice = use.parent;
  if (
    !ownerName.startsWith("__") ||
    !ownerName.endsWith("_prefix") ||
    callName(prefix) !== "seq" ||
    prefix.arguments.length !== 2 ||
    !keyword(prefix.arguments[0]) ||
    optionalValue(prefix.arguments[1]) !== choice ||
    callName(choice) !== "choice" ||
    choice.arguments.length < 2 ||
    !choice.arguments.includes(use)
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

  if (!localRules.has(groupName)) return false;
  const continuation = localRules.get(tailName);
  const continuationSequence =
    callName(continuation) === "prec.right" && continuation.arguments.length === 1
      ? continuation.arguments[0]
      : continuation;
  if (callName(continuationSequence) !== "seq" || continuationSequence.arguments.length !== 4)
    return false;
  const [again, nextSelector, nextGroup, nextTail] = continuationSequence.arguments;
  return (
    keyword(again) &&
    context.sourceCode.getText(marker) === context.sourceCode.getText(again) &&
    memberName(nextSelector) === selectorName &&
    memberName(nextGroup) === groupName &&
    memberName(optionalValue(nextTail)) === tailName
  );
}

function isRequiredListBodyTail(body, use, owner, localRules) {
  const ownerName = ruleName(owner);
  const sequence = owner.value.body;
  if (
    !ownerName.startsWith("__") ||
    !ownerName.endsWith("_statement_body") ||
    callName(sequence) !== "seq" ||
    sequence.arguments.length !== 2 ||
    sequence.arguments[1] !== use
  )
    return false;

  const prefix = memberName(sequence.arguments[0]);
  const list = memberName(body.arguments[0]);
  const phrase = memberName(optionalValue(body.arguments[1]));
  if (
    !prefix?.startsWith("__") ||
    !prefix.endsWith("_prefix") ||
    !localRules.has(prefix) ||
    !list?.startsWith("__") ||
    list === prefix ||
    !phrase ||
    phrase.startsWith("_") ||
    !phrase.endsWith("_phrase")
  )
    return false;

  const repetition = localRules.get(list);
  if (callName(repetition) !== "prec.right" || repetition.arguments.length !== 1) return false;
  const items = repetition.arguments[0];
  if (callName(items) !== "seq" || items.arguments.length !== 2) return false;
  const [field, tail] = items.arguments;
  return (
    callName(field) === "field" &&
    field.arguments.length === 2 &&
    field.arguments[0].type === "Literal" &&
    typeof field.arguments[0].value === "string" &&
    Boolean(field.arguments[0].value) &&
    memberName(field.arguments[1]) !== null &&
    memberName(optionalValue(tail)) === list
  );
}

function canInlinePrivateBody(context, property, owner, localRules, references, extraSymbols) {
  const body = property.value.body;
  const sequence = owner.value.body;
  if (
    property.parent.properties.some((entry) => entry.type === "SpreadElement" || entry.computed) ||
    !isStaticDsl(sequence) ||
    !isStaticDsl(body)
  )
    return false;

  const suppressed = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" && node.arguments.some(suppressed));
  if (
    isRuleDisabled(context, property) ||
    isRuleDisabled(context, owner) ||
    suppressed(sequence) ||
    suppressed(body)
  )
    return false;

  const name = ruleName(property);
  const ownerName = ruleName(owner);
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
  return ![...referencedSymbols(body), ...extraSymbols].some(recursive);
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
        const privateBody = name.endsWith("_body");
        const selectorBody = privateBody && body.arguments.length === 4;
        const listTailBody = privateBody && body.arguments.length === 2;
        if (privateBody && !selectorBody && !listTailBody) continue;
        if (
          !privateBody &&
          (body.arguments.length < 2 ||
            body.arguments.length > 3 ||
            !body.arguments.every(isSmallSequenceElement))
        )
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const use = uses[0];
        const owner = enclosingRule(use);
        if (!owner || owner === property || owner.parent !== property.parent) continue;
        if (privateBody) {
          if (dynamicReference) continue;
          const localRules = new Map(
            properties
              .filter((other) => other.parent === property.parent)
              .map((other) => [ruleName(other), other.value.body]),
          );
          const matches = selectorBody
            ? isOptionalSelectorChoiceArm(context, body, use, owner, localRules)
            : isRequiredListBodyTail(body, use, owner, localRules);
          if (!matches) continue;
          const extraSymbols = listTailBody ? [memberName(owner.value.body.arguments[0])] : [];
          if (!canInlinePrivateBody(context, property, owner, localRules, references, extraSymbols))
            continue;
        }
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
            : listTailBody
              ? `${name} is the sole unaliased tail of ${ruleName(owner)}; try inlining its required field list and optional phrase while retaining the separate prefix and statement body. Preserve field scope and optionality, then compare parser metrics, parsing speed and complete valid and recovery trees.`
              : `${name} has one unaliased local use in ${ruleName(owner)}; try inlining this small sequence. Check external references, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest measuring inlining of small, locally single-use private sequences");
