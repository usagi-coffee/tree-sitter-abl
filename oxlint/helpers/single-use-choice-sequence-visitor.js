import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  isSmallSequenceElement,
  isStaticDsl,
  isStaticKeywordCall,
  memberName,
  report,
  ruleName,
} from "../helpers.js";
import { isStructuredFieldChoiceBranch } from "./structured-field-choice-branch.js";

export function singleUseChoiceSequenceVisitor(context, fieldChoice = false, withAlias = false) {
  const properties = [];
  const references = new Map();
  let dynamicReference = false;
  const smallElement = (node) => isSmallSequenceElement(node) || isStaticKeywordCall(node);
  const symbolAlias = (node) => {
    if (callName(node) !== "alias" || node.arguments.length !== 2) return false;
    const source = memberName(node.arguments[0]);
    const target = memberName(node.arguments[1]);
    return (
      source !== null &&
      !source.endsWith("_keyword") &&
      target !== null &&
      !target.startsWith("_") &&
      source !== target
    );
  };
  const atom = (node) =>
    memberName(node) !== null ||
    (node?.type === "Literal" && typeof node.value === "string" && node.value.length > 0) ||
    isStaticKeywordCall(node);
  const alternative = (node) => {
    if (atom(node)) return true;
    if (callName(node) !== "alias" || node.arguments.length !== 2 || !atom(node.arguments[0]))
      return false;
    const target = memberName(node.arguments[1]);
    return target !== null && !target.startsWith("_");
  };
  const smallChoice = (node) => {
    if (fieldChoice) {
      if (callName(node) !== "field" || node.arguments.length !== 2) return false;
      node = node.arguments[1];
    }
    return (
      callName(node) === "choice" &&
      node.arguments.length >= 2 &&
      node.arguments.length <= 5 &&
      node.arguments.every(fieldChoice ? alternative : smallElement)
    );
  };
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      if (node.object.type === "Identifier" && node.object.name === "$" && !memberName(node))
        dynamicReference = true;
      const name =
        memberName(node) ??
        (node.computed &&
        node.object.type === "Identifier" &&
        node.object.name === "$" &&
        node.property.type === "Literal" &&
        typeof node.property.value === "string"
          ? node.property.value
          : null);
      if (!name) return;
      if (!references.has(name)) references.set(name, []);
      references.get(name).push(node);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property);
        const body = property.value.body;
        if (!name.startsWith("__") || name.endsWith("_body")) continue;
        if (isRuleDisabled(context, property) || !isStaticDsl(body)) continue;
        if (callName(body) !== "seq") continue;
        const structured = fieldChoice && !withAlias && body.arguments.length === 4;
        const small =
          body.arguments.length >= 2 &&
          body.arguments.length <= 3 &&
          body.arguments.some(smallChoice) &&
          (!withAlias || body.arguments.some(symbolAlias)) &&
          body.arguments.every(
            (element) =>
              smallElement(element) || smallChoice(element) || (withAlias && symbolAlias(element)),
          );
        if (!small && !structured) continue;
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
        if (
          structured &&
          (dynamicReference ||
            !isStructuredFieldChoiceBranch(context, property, use, properties, references))
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
          withAlias
            ? "single-use-choice-alias-sequence"
            : fieldChoice
              ? "single-use-field-choice-sequence"
              : "single-use-choice-sequence",
          structured
            ? `${name} has one unaliased choice-arm use in ${ruleName(owner)}; try inlining this structured field-choice branch while retaining its shared suffix helper. Preserve alternative order, field scope, aliases, keyword options and precedence; check external references and metadata, then compare actions, table bytes, memory, parsing speed and complete valid and recovery trees before retaining the change.`
            : `${name} has one unaliased local use in ${ruleName(owner)}; try inlining this small sequence containing a ${fieldChoice ? "field-wrapped" : "direct"} choice${withAlias ? " and symbol alias" : ""}. Preserve alternative order, fields${fieldChoice || withAlias ? ", aliases" : ""} and precedence, check external references and grammar metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}
