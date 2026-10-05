import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  isSmallSequenceElement,
  isStaticKeywordCall,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const singleUseKeywordSequence = rule((context) => {
  const properties = [];
  const references = new Map();
  const smallElement = (node) => {
    if (isSmallSequenceElement(node) || isStaticKeywordCall(node)) return true;
    if (callName(node) === "optional" && node.arguments.length === 1)
      return smallElement(node.arguments[0]);
    if (callName(node) === "field" && node.arguments.length === 2)
      return smallElement(node.arguments[1]);
    return false;
  };
  const hasKeyword = (node) => {
    if (isStaticKeywordCall(node)) return true;
    if (callName(node) === "optional") return hasKeyword(node.arguments[0]);
    if (callName(node) === "field") return hasKeyword(node.arguments[1]);
    return false;
  };
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      const name = memberName(node);
      if (!name) return;
      const uses = references.get(name) ?? [];
      uses.push(node);
      references.set(name, uses);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property);
        const body = property.value.body;
        if (!name.startsWith("__") || name.endsWith("_body")) continue;
        if (callName(body) !== "seq" || body.arguments.length < 2 || body.arguments.length > 3)
          continue;
        if (!body.arguments.every(smallElement) || !body.arguments.some(hasKeyword)) continue;
        if (isRuleDisabled(context, property)) continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const use = uses[0];
        const owner = enclosingRule(use);
        if (!owner || owner === property || owner.parent !== property.parent) continue;
        let unsafe = false;
        for (let parent = use.parent; parent !== owner; parent = parent.parent) {
          if (["alias", "token", "token.immediate"].includes(callName(parent))) unsafe = true;
        }
        if (unsafe) continue;
        report(
          context,
          property,
          "single-use-keyword-sequence",
          `${name} has one unaliased local use in ${ruleName(owner)}; try inlining this small keyword sequence. Preserve keyword options, fields and ordering; check external references and grammar metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest measuring inlining of small single-use private sequences containing static kw calls");
