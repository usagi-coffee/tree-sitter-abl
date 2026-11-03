import {
  callName,
  enclosingRule,
  isNullable,
  isRuleDisabled,
  isRuleProperty,
  isStaticDsl,
  memberName,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { projectPrecedenceSymbols, rootMetadataSymbols } from "../helpers/project-metadata.js";

export const existingAlternativeBodyReuse = rule((context) => {
  const properties = [],
    candidates = [],
    restricted = rootMetadataSymbols(context, [
      "inline",
      "conflicts",
      "precedences",
      "supertypes",
      "externals",
      "extras",
      "word",
    ]);
  for (const name of projectPrecedenceSymbols(context)) restricted.add(name);
  let dynamicReference = false;
  const signature = (node) =>
    JSON.stringify(context.sourceCode.getTokens(node).map(({ type, value }) => [type, value]));
  const unsafe = (node) =>
    isRuleDisabled(context, node) ||
    ["token", "token.immediate", "prec.dynamic"].includes(callName(node)) ||
    (node.type === "CallExpression" && node.arguments.some(unsafe));
  const nullable = (node) => {
    if (node?.type === "Literal" && node.value === "") return true;
    const name = callName(node);
    if (name === "field") return nullable(node.arguments[1]);
    if (name === "alias" || name === "repeat1") return nullable(node.arguments[0]);
    if (["prec", "prec.left", "prec.right"].includes(name)) return nullable(node.arguments.at(-1));
    if (name === "seq") return node.arguments.every(nullable);
    if (name === "choice") return node.arguments.some(nullable);
    return isNullable(node);
  };
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      if (node.object.type !== "Identifier" || node.object.name !== "$") return;
      const name = memberName(node);
      if (!name) dynamicReference = true;
      else if (!enclosingRule(node)) restricted.add(name);
    },
    CallExpression(node) {
      const owner = enclosingRule(node),
        alternatives = node.parent;
      if (
        !owner ||
        !ruleName(owner).startsWith("__") ||
        callName(node) !== "seq" ||
        node.arguments.length < 2 ||
        callName(alternatives) !== "choice" ||
        alternatives.arguments.length < 2 ||
        !isStaticDsl(node) ||
        nullable(node) ||
        unsafe(node) ||
        isRuleDisabled(context, owner)
      )
        return;
      for (let parent = alternatives; parent !== owner; parent = parent.parent) {
        if (isRuleDisabled(context, parent)) return;
        if (
          parent.type === "CallExpression" &&
          (![
            "seq",
            "choice",
            "optional",
            "repeat",
            "repeat1",
            "prec",
            "prec.left",
            "prec.right",
          ].includes(callName(parent)) ||
            !isStaticDsl(parent))
        )
          return;
      }
      candidates.push({ node, owner, alternatives });
    },
    "Program:exit"() {
      if (dynamicReference) return;
      for (const { node, owner, alternatives } of candidates) {
        const ownerName = ruleName(owner);
        if (restricted.has(ownerName)) continue;
        const localRules = new Map(
          properties
            .filter((property) => property.parent === owner.parent)
            .map((property) => [ruleName(property), property]),
        );
        const siblings = alternatives.arguments.filter((branch) => branch !== node);
        const existing = new Set(siblings.flatMap(referencedSymbols));
        for (const name of existing) {
          const helper = localRules.get(name),
            body = helper?.value.body;
          if (
            !name.startsWith("__") ||
            !helper ||
            helper === owner ||
            restricted.has(name) ||
            isRuleDisabled(context, helper) ||
            callName(body) !== "seq" ||
            !isStaticDsl(body) ||
            unsafe(body) ||
            signature(node) !== signature(body)
          )
            continue;
          const cyclic = (symbol, active = new Set()) => {
            if (symbol === ownerName || active.has(symbol)) return true;
            const definition = localRules.get(symbol);
            if (!definition) return false;
            const next = new Set(active).add(symbol);
            return (
              !isStaticDsl(definition.value.body) ||
              referencedSymbols(definition.value.body).some((child) => cyclic(child, next))
            );
          };
          if (cyclic(name)) continue;
          report(
            context,
            node,
            "existing-alternative-body-reuse",
            `${name} already appears in another branch of this choice, while this branch expands its exact non-recursive sequence; try replacing only the expanded branch with the existing hidden helper. Preserve fields, aliases, token identities, optionality and branch order. Check cross-file references and metadata, then compare actions, table bytes, memory, parsing speed and complete valid and recovery trees before retaining the reuse.`,
          );
          break;
        }
      }
    },
  };
}, "Suggest reusing an existing choice helper where another alternative expands its exact body");
