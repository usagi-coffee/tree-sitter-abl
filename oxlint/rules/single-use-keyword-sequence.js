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
import { isFixedKeywordFieldBranch } from "../helpers/fixed-keyword-field-branch.js";

export const singleUseKeywordSequence = rule((context) => {
  const properties = [];
  const references = new Map();
  let dynamicReference = false;
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
      if (!name) {
        if (node.object.type === "Identifier" && node.object.name === "$") dynamicReference = true;
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
        if (!name.startsWith("__") || name.endsWith("_body")) continue;
        if (callName(body) !== "seq" || ![2, 3, 5].includes(body.arguments.length)) continue;
        if (!body.arguments.every(smallElement) || !body.arguments.some(hasKeyword)) continue;
        if (isRuleDisabled(context, property)) continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const use = uses[0];
        const owner = enclosingRule(use);
        if (!owner || owner === property || owner.parent !== property.parent) continue;
        const fixedBranch = body.arguments.length === 5;
        if (
          fixedBranch &&
          (dynamicReference || !isFixedKeywordFieldBranch(context, property, use, properties))
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
          "single-use-keyword-sequence",
          fixedBranch
            ? `${name} has one unaliased choice-arm use in ${ruleName(owner)}; try inlining this five-part required keyword/field branch. Preserve keyword options, token identities, field scope and branch order; check external references and grammar metadata, then compare actions, table bytes, memory, parsing speed and complete valid and recovery trees.`
            : `${name} has one unaliased local use in ${ruleName(owner)}; try inlining this small keyword sequence. Preserve keyword options, fields and ordering; check external references and grammar metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest inlining small keyword sequences and fixed keyword/field branches with one private use");
