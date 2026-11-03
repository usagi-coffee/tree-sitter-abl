import {
  callName,
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

export const leftRecursiveOptionList = rule((context) => {
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
  const rightBody = (node) =>
    callName(node) === "prec.right" && node.arguments.length === 1 ? node.arguments[0] : null;
  const suppressed = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" && node.arguments.some(suppressed));
  let dynamicReference = false;
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
          original = property.value.body,
          body = rightBody(original);
        if (
          !name.startsWith("__") ||
          property.computed ||
          property.parent.properties.some((entry) => entry.type === "SpreadElement") ||
          restricted.has(name) ||
          isRuleDisabled(context, property) ||
          suppressed(original) ||
          callName(body) !== "seq" ||
          body.arguments.length !== 2
        )
          continue;
        const [item, tail] = body.arguments,
          itemName = memberName(item);
        if (
          !itemName?.startsWith("__") ||
          callName(tail) !== "optional" ||
          tail.arguments.length !== 1 ||
          memberName(tail.arguments[0]) !== name
        )
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 2) continue;
        const use = uses.find((reference) => enclosingRule(reference) !== property),
          wrapper = use && enclosingRule(use),
          wrapperName = wrapper && ruleName(wrapper);
        if (
          !wrapper ||
          wrapper.computed ||
          wrapper.parent !== property.parent ||
          wrapperName.startsWith("_") ||
          restricted.has(wrapperName) ||
          isRuleDisabled(context, wrapper) ||
          suppressed(wrapper.value.body) ||
          memberName(rightBody(wrapper.value.body) ?? wrapper.value.body) !== name
        )
          continue;
        const definition = (symbol) =>
          properties.find(
            (other) => other.parent === property.parent && ruleName(other) === symbol,
          );
        const option = definition(itemName),
          alternatives = option?.value.body;
        if (
          !option ||
          option.computed ||
          restricted.has(itemName) ||
          isRuleDisabled(context, option) ||
          suppressed(alternatives) ||
          callName(alternatives) !== "choice" ||
          alternatives.arguments.length < 2 ||
          !alternatives.arguments.every((branch) => memberName(branch))
        )
          continue;
        const symbols = alternatives.arguments.map(memberName);
        if (
          !symbols.some((symbol) => symbol.startsWith("_kw_")) ||
          !symbols.some((symbol) => !symbol.startsWith("_kw_"))
        )
          continue;
        const recursive = (symbol, seen = new Set()) => {
          if (symbol === name || symbol === wrapperName) return true;
          if (seen.has(symbol)) return false;
          seen.add(symbol);
          const dependency = definition(symbol);
          return dependency
            ? !isStaticDsl(dependency.value.body) ||
                referencedSymbols(dependency.value.body).some((next) => recursive(next, seen))
            : false;
        };
        if (symbols.some((symbol) => recursive(symbol))) continue;
        report(
          context,
          property,
          "left-recursive-option-list",
          `${name} is a right-recursive option list behind the public forwarding rule ${wrapperName}; try seq(optional($.${name}), $.${itemName}) while retaining the list's right associativity and adding prec.right to the public wrapper if needed for greedy option attachment. Preserve the item alternatives, fields, aliases, order and one-item minimum. Check cross-file uses and metadata, then compare actions, table bytes, memory, parsing speed and complete valid and recovery trees before retaining the change.`,
        );
      }
    },
  };
}, "Suggest left recursion for private option lists behind a public forwarding rule");
