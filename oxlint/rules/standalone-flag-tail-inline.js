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

export const standaloneFlagTailInline = rule((context) => {
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
      if (!enclosingRule(node)) restricted.add(name);
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
          callName(body) !== "seq" ||
          body.arguments.length < 2 ||
          !isStaticDsl(body) ||
          disabled(body)
        )
          continue;
        const [flag, ...tail] = body.arguments;
        if (
          callName(flag) !== "alias" ||
          flag.arguments.length !== 2 ||
          (!isStaticKeywordCall(flag.arguments[0]) &&
            !memberName(flag.arguments[0])?.startsWith("_kw_")) ||
          !memberName(flag.arguments[1]) ||
          memberName(flag.arguments[1]).startsWith("_") ||
          !tail.every(
            (part) =>
              callName(part) === "optional" &&
              part.arguments.length === 1 &&
              memberName(part.arguments[0])?.startsWith("_"),
          )
        )
          continue;
        const recursive = (symbol, seen = new Set()) => {
          if (symbol === name) return true;
          if (seen.has(symbol)) return false;
          seen.add(symbol);
          const definition = properties.find(
            (other) => other.parent === property.parent && ruleName(other) === symbol,
          );
          return definition
            ? referencedSymbols(definition.value.body).some((next) => recursive(next, seen))
            : false;
        };
        if (referencedSymbols(body).some((symbol) => recursive(symbol))) continue;
        const uses = references.get(name) ?? [];
        if (uses.length < 2) continue;
        const owner = enclosingRule(uses[0]),
          choice = owner?.value.body;
        if (
          !owner ||
          owner === property ||
          owner.parent !== property.parent ||
          restricted.has(ruleName(owner)) ||
          isRuleDisabled(context, owner) ||
          callName(choice) !== "choice" ||
          !isStaticDsl(choice) ||
          isRuleDisabled(context, choice)
        )
          continue;
        const standalone = uses.filter((use) => use.parent === choice);
        if (standalone.length !== 1) continue;
        if (
          !uses.every((use) => {
            if (enclosingRule(use) !== owner || isRuleDisabled(context, use)) return false;
            if (use === standalone[0]) return true;
            let current = use,
              element = use,
              optional = false;
            while (current.parent !== choice) {
              const parent = current.parent;
              if (
                !["seq", "choice", "optional"].includes(callName(parent)) ||
                isRuleDisabled(context, parent)
              )
                return false;
              optional ||= callName(parent) === "optional";
              element = current;
              current = parent;
            }
            return (
              optional &&
              callName(current) === "seq" &&
              current.arguments
                .slice(0, current.arguments.indexOf(element))
                .some((prefix) => !isNullable(prefix))
            );
          })
        )
          continue;
        report(
          context,
          standalone[0],
          "standalone-flag-tail-inline",
          `${name} is a standalone choice branch and an optional tail after other prefixes; try expanding its complete flag-led sequence only in the standalone branch, retaining the helper in every prefixed optional branch. Preserve the named flag, ordered optional suffixes and nested boundaries; check external uses and metadata, prioritize LARGE_STATE_COUNT before ACTION_COUNT, and compare complete valid and recovery trees.`,
        );
      }
    },
  };
}, "Suggest expanding standalone flag tails while retaining their prefixed optional boundaries");
