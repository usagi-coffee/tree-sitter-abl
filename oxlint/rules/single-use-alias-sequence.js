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
  rule,
  ruleName,
} from "../helpers.js";

export const singleUseAliasSequence = rule((context) => {
  const properties = [];
  const references = new Map();
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
          `${name} has one unaliased local use in ${ruleName(owner)}; try inlining this small sequence with its symbol aliases intact. Preserve alias targets, fields and precedence, check external references and grammar metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest inlining single-use private sequences containing symbol aliases");
