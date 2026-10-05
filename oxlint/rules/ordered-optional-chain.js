import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  isStaticDsl,
  isStaticKeywordCall,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const orderedOptionalChain = rule((context) => {
  const properties = [];
  const candidates = [];
  const references = new Map();
  const signature = (node) =>
    JSON.stringify(context.sourceCode.getTokens(node).map(({ type, value }) => [type, value]));
  const requiredElement = (node) => {
    if (memberName(node) || isStaticKeywordCall(node)) return true;
    if (node?.type === "Literal") return typeof node.value === "string" && node.value.length > 0;
    if (callName(node) === "field" && node.arguments.length === 2)
      return requiredElement(node.arguments[1]);
    if (callName(node) === "alias" && node.arguments.length === 2)
      return requiredElement(node.arguments[0]);
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
    CallExpression(node) {
      if (callName(node) === "optional" && node.arguments.length === 1) candidates.push(node);
    },
    "Program:exit"() {
      for (const node of candidates) {
        const owner = enclosingRule(node);
        if (
          !owner ||
          isRuleDisabled(context, owner) ||
          isRuleDisabled(context, node) ||
          !isStaticDsl(node)
        )
          continue;
        let unsafe = false;
        for (let parent = node.parent; parent !== owner; parent = parent.parent) {
          if (
            [
              "alias",
              "token",
              "token.immediate",
              "prec",
              "prec.left",
              "prec.right",
              "prec.dynamic",
            ].includes(callName(parent))
          )
            unsafe = true;
        }
        if (unsafe) continue;
        const alternatives = node.arguments[0];
        if (callName(alternatives) !== "choice" || alternatives.arguments.length !== 3) continue;
        const [first, helperUse, last] = alternatives.arguments;
        if (
          callName(first) !== "seq" ||
          first.arguments.length !== 2 ||
          !requiredElement(first.arguments[0])
        )
          continue;
        const remainder = first.arguments[1];
        if (callName(remainder) !== "optional" || remainder.arguments.length !== 1) continue;
        const suffix = remainder.arguments[0];
        if (callName(suffix) !== "choice" || suffix.arguments.length !== 2) continue;
        if (
          signature(suffix.arguments[0]) !== signature(helperUse) ||
          signature(suffix.arguments[1]) !== signature(last)
        )
          continue;
        const name = memberName(helperUse);
        if (!name?.startsWith("__") || name.endsWith("_body")) continue;
        const helper = properties.find(
          (property) => ruleName(property) === name && property.parent === owner.parent,
        );
        if (!helper || helper === owner || isRuleDisabled(context, helper)) continue;
        const body = helper.value.body;
        if (callName(body) !== "seq" || body.arguments.length !== 2 || !isStaticDsl(body)) continue;
        if (!requiredElement(body.arguments[0]) || !requiredElement(last)) continue;
        const tail = body.arguments[1];
        if (
          callName(tail) !== "optional" ||
          tail.arguments.length !== 1 ||
          signature(tail.arguments[0]) !== signature(last)
        )
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 2 || !uses.includes(helperUse) || !uses.includes(suffix.arguments[0]))
          continue;
        if (
          isRuleDisabled(context, alternatives) ||
          isRuleDisabled(context, first) ||
          isRuleDisabled(context, suffix)
        )
          continue;
        report(
          context,
          node,
          "ordered-optional-chain",
          `This nested choice enumerates three independently optional elements in order, with the last two represented by ${name}; try replacing it with three ordered optional elements and inlining that helper. Preserve fields, aliases, token identity and element order, check external references and metadata, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest simplifying nested choices that enumerate an ordered optional chain");
