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
        if (callName(body) !== "seq" || ![2, 3, 4, 5, 7].includes(body.arguments.length)) continue;
        const suffixBranch = body.arguments.length === 4;
        if (!name.startsWith("__") || (name.endsWith("_body") && !suffixBranch)) continue;
        const fixedBranch = body.arguments.length === 5;
        const qualifiedBranch = body.arguments.length === 7;
        const structuredBranch = suffixBranch || fixedBranch || qualifiedBranch;
        if (
          !suffixBranch &&
          !qualifiedBranch &&
          (!body.arguments.every(smallElement) || !body.arguments.some(hasKeyword))
        )
          continue;
        if (isRuleDisabled(context, property)) continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const use = uses[0];
        const owner = enclosingRule(use);
        if (!owner || owner === property || owner.parent !== property.parent) continue;
        if (
          structuredBranch &&
          (dynamicReference ||
            !isFixedKeywordFieldBranch(context, property, use, properties, references))
        )
          continue;
        let unsafe = false;
        for (let parent = use.parent; parent !== owner; parent = parent.parent) {
          if (["alias", "token", "token.immediate"].includes(callName(parent))) unsafe = true;
        }
        if (unsafe) continue;
        const scope = `${name} has one unaliased`;
        const ownerName = ruleName(owner);
        const measure =
          "check external references and grammar metadata, then compare actions, table bytes, memory, parsing speed and complete valid and recovery trees.";
        let message = `${scope} local use in ${ownerName}; try inlining this small keyword sequence. Preserve keyword options, fields and ordering; check external references and grammar metadata, then measure parser size and validate trees.`;
        if (suffixBranch)
          message = `${scope} choice-arm suffix use in ${ownerName}. Try inlining the required fields and keyword while retaining their shared trailing helper. Preserve field scope, aliases, token identities and branch order. Before keeping the change, ${measure}`;
        else if (qualifiedBranch)
          message = `${scope} choice-arm use in ${ownerName}; try inlining this qualified-field branch with its optional keyword modifier and trailing flag. Preserve keyword options, token identities, field scope, aliases and branch order; ${measure}`;
        else if (fixedBranch)
          message = `${scope} choice-arm use in ${ownerName}; try inlining this five-part required keyword/field branch. Preserve keyword options, token identities, field scope and branch order; ${measure}`;
        report(context, property, "single-use-keyword-sequence", message);
      }
    },
  };
}, "Suggest inlining single-use private keyword sequences and structured keyword/field branches");
