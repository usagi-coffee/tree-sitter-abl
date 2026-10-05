import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  memberName,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { rootInlineSymbols } from "../helpers/project-metadata.js";

export const optionalSelectorBodyInline = rule((context) => {
  const properties = [],
    references = new Map(),
    restricted = rootInlineSymbols(context);
  const selectorAlternative = (node) => {
    if (memberName(node)) return true;
    if (callName(node) !== "alias" || node.arguments.length !== 2) return false;
    const source = memberName(node.arguments[0]),
      target = memberName(node.arguments[1]);
    return source && target && !target.startsWith("_") && source !== target;
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
      if (!enclosingRule(node)) restricted.add(name);
    },
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (!name.startsWith("__") || restricted.has(name) || isRuleDisabled(context, property))
          continue;
        if (callName(body) !== "seq" || body.arguments.length !== 2) continue;
        const [optionalSelector, tail] = body.arguments;
        if (callName(optionalSelector) !== "optional" || optionalSelector.arguments.length !== 1)
          continue;
        const selector = optionalSelector.arguments[0];
        if (
          callName(selector) !== "choice" ||
          selector.arguments.length < 2 ||
          selector.arguments.length > 5 ||
          !selector.arguments.every(selectorAlternative) ||
          !memberName(tail)?.startsWith("_") ||
          referencedSymbols(body).includes(name)
        )
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const use = uses[0],
          owner = enclosingRule(use),
          optionalUse = use.parent;
        if (
          memberName(use) !== name ||
          !owner ||
          owner === property ||
          owner.parent !== property.parent ||
          callName(optionalUse) !== "optional" ||
          optionalUse.arguments.length !== 1 ||
          optionalUse.arguments[0] !== use ||
          isRuleDisabled(context, owner) ||
          isRuleDisabled(context, use) ||
          isRuleDisabled(context, optionalUse)
        )
          continue;
        let unsafe = false;
        for (let parent = optionalUse.parent; parent !== owner; parent = parent.parent) {
          if (
            parent.type === "CallExpression" &&
            !["seq", "choice", "optional", "prec", "prec.left", "prec.right"].includes(
              callName(parent),
            )
          )
            unsafe = true;
        }
        if (unsafe) continue;
        report(
          context,
          property,
          "optional-selector-body-inline",
          `${name} only adds an optional symbol selector before a required hidden tail and has one unaliased local optional use in ${ruleName(owner)}; try inlining the complete body inside that same optional wrapper. Preserve selector order, aliases, tail fields and precedence, check external references and metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest inlining private optional-selector bodies at a single optional use");
