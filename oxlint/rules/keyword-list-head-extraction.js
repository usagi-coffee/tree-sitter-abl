import {
  callName,
  enclosingRule,
  isNullable,
  isRuleDisabled,
  isRuleProperty,
  isStaticDsl,
  isStaticKeywordCall,
  memberName,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { projectPrecedenceSymbols, rootMetadataSymbols } from "../helpers/project-metadata.js";

export const keywordListHeadExtraction = rule((context) => {
  const properties = [],
    references = new Map(),
    restricted = rootMetadataSymbols(context, [
      "inline",
      "conflicts",
      "supertypes",
      "externals",
      "word",
    ]);
  for (const name of projectPrecedenceSymbols(context)) restricted.add(name);
  let dynamicReference = false;
  const keyword = (node) => memberName(node)?.startsWith("_kw_") || isStaticKeywordCall(node);
  const signature = (node) =>
    JSON.stringify(context.sourceCode.getTokens(node).map(({ type, value }) => [type, value]));
  const nullable = (node) => {
    const name = callName(node);
    if (name === "field") return nullable(node.arguments[1]);
    if (name === "alias" || name === "repeat1") return nullable(node.arguments[0]);
    if (name === "seq") return node.arguments.every(nullable);
    if (name === "choice") return node.arguments.some(nullable);
    return isNullable(node);
  };
  const disabled = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" && node.arguments.some(disabled));
  const restrictedItem = (node) =>
    node.type === "CallExpression" &&
    (["token", "token.immediate", "prec", "prec.left", "prec.right", "prec.dynamic"].includes(
      callName(node),
    ) ||
      node.arguments.some(restrictedItem));
  const safeContext = (node, owner) => {
    if (restricted.has(ruleName(owner)) || isRuleDisabled(context, owner)) return false;
    for (let current = node; current !== owner; current = current.parent) {
      if (isRuleDisabled(context, current)) return false;
      if (
        current.type === "CallExpression" &&
        (!["seq", "choice", "optional", "repeat", "repeat1"].includes(callName(current)) ||
          !isStaticDsl(current))
      )
        return false;
    }
    return true;
  };
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      if (node.object.type !== "Identifier" || node.object.name !== "$") return;
      const name = memberName(node);
      if (!name) {
        dynamicReference = true;
        return;
      }
      if (!enclosingRule(node)) restricted.add(name);
      if (!references.has(name)) references.set(name, []);
      references.get(name).push(node);
    },
    "Program:exit"() {
      if (dynamicReference) return;
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (
          !name.startsWith("__") ||
          restricted.has(name) ||
          callName(body) !== "seq" ||
          body.arguments.length < 3 ||
          body.arguments.length > 6 ||
          !keyword(body.arguments[0]) ||
          !isStaticDsl(body) ||
          disabled(body) ||
          isRuleDisabled(context, property)
        )
          continue;
        const continuation = body.arguments.at(-1),
          items = body.arguments.slice(1, -1);
        if (
          callName(continuation) !== "optional" ||
          continuation.arguments.length !== 1 ||
          memberName(continuation.arguments[0]) !== name ||
          items.every(nullable) ||
          items.some((item) => referencedSymbols(item).includes(name) || restrictedItem(item))
        )
          continue;
        const uses = references.get(name) ?? [],
          use = uses.find((node) => node !== continuation.arguments[0]),
          optional = use?.parent,
          head = optional?.parent,
          owner = use && enclosingRule(use);
        if (
          uses.length !== 2 ||
          !owner ||
          owner === property ||
          owner.parent !== property.parent ||
          callName(optional) !== "optional" ||
          optional.arguments.length !== 1 ||
          callName(head) !== "seq" ||
          head.arguments.length !== body.arguments.length ||
          head.arguments.at(-1) !== optional ||
          !keyword(head.arguments[0]) ||
          !isStaticDsl(head) ||
          !body.arguments
            .slice(1)
            .every((part, index) => signature(part) === signature(head.arguments[index + 1])) ||
          disabled(head) ||
          !safeContext(head, owner)
        )
          continue;
        report(
          context,
          head,
          "keyword-list-head-extraction",
          `This keyword-led list repeats the non-empty item and continuation in ${name}; try extracting one hidden list head and replacing the tail helper with an optional sequence of its exact keyword separator and that head. Check external references before removing the tail, preserve item fields, aliases, keyword options and order, then prioritize LARGE_STATE_COUNT followed by ACTION_COUNT and compare complete valid and recovery trees.`,
        );
      }
    },
  };
}, "Suggest a shared recursive head for keyword-separated lists with one tail caller");
