import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  isStaticDsl,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { projectPrecedenceSymbols, rootMetadataSymbols } from "../helpers/project-metadata.js";

export const sharedOrderedPairInline = rule((context) => {
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
  const publicSymbol = (node) => {
    const name = memberName(node);
    return name && !name.startsWith("_") ? name : null;
  };
  const suppressed = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" && node.arguments.some(suppressed));
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
          !name.startsWith("_") ||
          name.startsWith("__") ||
          restricted.has(name) ||
          isRuleDisabled(context, property) ||
          callName(body) !== "choice" ||
          body.arguments.length !== 2 ||
          !isStaticDsl(body) ||
          suppressed(body)
        )
          continue;
        const [pair, standalone] = body.arguments;
        if (callName(pair) !== "seq" || pair.arguments.length !== 2) continue;
        const [first, tail] = pair.arguments,
          firstName = publicSymbol(first),
          secondName = publicSymbol(standalone);
        if (
          !firstName ||
          !secondName ||
          firstName === secondName ||
          callName(tail) !== "optional" ||
          tail.arguments.length !== 1 ||
          memberName(tail.arguments[0]) !== secondName
        )
          continue;
        if (
          !(references.get(name) ?? []).every((use) => {
            const owner = enclosingRule(use);
            if (!owner || owner === property || isRuleDisabled(context, owner)) return false;
            for (let current = use; current !== owner; current = current.parent) {
              if (isRuleDisabled(context, current)) return false;
              if (
                current.type === "CallExpression" &&
                (![
                  "seq",
                  "choice",
                  "optional",
                  "repeat",
                  "repeat1",
                  "prec",
                  "prec.left",
                  "prec.right",
                ].includes(callName(current)) ||
                  !isStaticDsl(current))
              )
                return false;
            }
            return true;
          })
        )
          continue;
        report(
          context,
          property,
          "shared-ordered-pair-inline",
          `${name} combines two visible nodes in a non-empty ordered pair, accepting either node alone or both in order; try adding it to grammar.inline. Check every cross-file use for fields, aliases and metadata dependencies. Preserve both named nodes, alternative order and caller optionality, then compare actions, table bytes, memory, parsing speed and complete valid and recovery trees before retaining the change.`,
        );
      }
    },
  };
}, "Suggest inlining shared helpers that combine two visible nodes in a non-empty ordered pair");
