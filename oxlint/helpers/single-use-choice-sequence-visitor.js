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

export function singleUseChoiceSequenceVisitor(context, fieldChoice = false, withAlias = false) {
  const properties = [];
  const references = new Map();
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
        if (callName(body) !== "seq" || body.arguments.length < 2 || body.arguments.length > 3)
          continue;
        if (!body.arguments.some(smallChoice)) continue;
        if (withAlias && !body.arguments.some(symbolAlias)) continue;
        if (
          !body.arguments.every(
            (element) =>
              smallElement(element) || smallChoice(element) || (withAlias && symbolAlias(element)),
          )
        )
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
          `${name} has one unaliased local use in ${ruleName(owner)}; try inlining this small sequence containing a ${fieldChoice ? "field-wrapped" : "direct"} choice${withAlias ? " and symbol alias" : ""}. Preserve alternative order, fields${fieldChoice || withAlias ? ", aliases" : ""} and precedence, check external references and grammar metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}
