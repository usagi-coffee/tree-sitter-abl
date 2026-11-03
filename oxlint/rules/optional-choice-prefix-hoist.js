import {
  callName,
  dslSignature,
  enclosingRule,
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

export const optionalChoicePrefixHoist = rule((context) => {
  const properties = [],
    references = new Map(),
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
  const disabled = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" && node.arguments.some(disabled));
  const safe = (node) =>
    isStaticDsl(node) &&
    !["token", "token.immediate", "prec.dynamic"].includes(callName(node)) &&
    (node.type !== "CallExpression" || node.arguments.every(safe));
  const nullable = (node) => {
    const name = callName(node);
    if (["field", "alias"].includes(name))
      return nullable(node.arguments[name === "field" ? 1 : 0]);
    if (["prec", "prec.left", "prec.right", "repeat1"].includes(name))
      return nullable(node.arguments.at(-1));
    if (["optional", "repeat"].includes(name)) return true;
    if (name === "seq") return node.arguments.every(nullable);
    if (name === "choice") return node.arguments.some(nullable);
    return node.type === "Literal" && node.value === "";
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
      const uses = references.get(name) ?? [];
      uses.push(node);
      references.set(name, uses);
      const owner = enclosingRule(node);
      if (!owner) restricted.add(name);
      for (let parent = node.parent; parent && parent !== owner; parent = parent.parent) {
        if (["alias", "token", "token.immediate", "prec.dynamic"].includes(callName(parent)))
          restricted.add(name);
      }
    },
    "Program:exit"() {
      if (dynamicReference) return;
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (
          !name.startsWith("__") ||
          restricted.has(name) ||
          isRuleDisabled(context, property) ||
          callName(body) !== "choice" ||
          body.arguments.length < 3 ||
          body.arguments.length > 8 ||
          !safe(body) ||
          disabled(body)
        )
          continue;
        const prefix = memberName(body.arguments.at(-1)),
          branches = body.arguments.slice(0, -1);
        if (
          !prefix ||
          prefix === name ||
          new Set(branches.map(dslSignature)).size !== branches.length
        )
          continue;
        if (
          !branches.every((branch) => {
            if (callName(branch) !== "seq" || branch.arguments.length < 2) return false;
            const [head, ...tail] = branch.arguments;
            return (
              callName(head) === "optional" &&
              head.arguments.length === 1 &&
              memberName(head.arguments[0]) === prefix &&
              !tail.every(nullable)
            );
          })
        )
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const use = uses[0],
          optional = use.parent,
          owner = enclosingRule(use);
        if (
          !owner ||
          owner === property ||
          owner.parent !== property.parent ||
          restricted.has(ruleName(owner)) ||
          isRuleDisabled(context, owner) ||
          callName(optional) !== "optional" ||
          optional.arguments.length !== 1 ||
          callName(optional.parent) !== "seq" ||
          referencedSymbols(body).includes(ruleName(owner))
        )
          continue;
        let unsafe = false;
        for (let parent = optional; parent !== owner; parent = parent.parent) {
          if (
            isRuleDisabled(context, parent) ||
            (parent.type === "CallExpression" &&
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
                !isStaticDsl(parent)))
          )
            unsafe = true;
        }
        if (unsafe) continue;
        report(
          context,
          property,
          "optional-choice-prefix-hoist",
          `${name} repeats optional(${prefix}) before non-empty alternatives and also accepts that prefix alone; try moving the optional prefix immediately before this helper's sole optional sequence use, removing the repeated prefixes and standalone branch. Retain the helper for the non-empty suffixes and preserve fields, aliases, token identities, branch order and caller precedence. Check cross-file uses and metadata, then compare actions, table bytes, memory, parsing speed and complete valid and recovery trees before retaining the change.`,
        );
      }
    },
  };
}, "Suggest hoisting repeated optional prefixes from optional non-empty choice helpers");
