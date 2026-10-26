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

export const privatePrecedenceOrderedPairInline = rule((context) => {
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
  const precedenceCalls = ["prec", "prec.left", "prec.right"];
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
          original = property.value.body;
        if (
          !name.startsWith("__") ||
          restricted.has(name) ||
          isRuleDisabled(context, property) ||
          !precedenceCalls.includes(callName(original)) ||
          !isStaticDsl(original) ||
          suppressed(original)
        )
          continue;
        let body = original;
        while (precedenceCalls.includes(callName(body))) {
          if (
            body.arguments.length < (callName(body) === "prec" ? 2 : 1) ||
            body.arguments.length > 2 ||
            (body.arguments.length === 2 && body.arguments[0].type !== "Literal")
          ) {
            body = null;
            break;
          }
          body = body.arguments.at(-1);
        }
        if (callName(body) !== "choice" || body.arguments.length !== 2) continue;
        const [pair, standalone] = body.arguments;
        if (callName(pair) !== "seq" || pair.arguments.length !== 2) continue;
        const [first, tail] = pair.arguments,
          firstName = memberName(first),
          secondName = memberName(standalone);
        if (
          !firstName ||
          !secondName ||
          firstName === secondName ||
          callName(tail) !== "optional" ||
          tail.arguments.length !== 1 ||
          memberName(tail.arguments[0]) !== secondName
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
            ? !isStaticDsl(definition.value.body) ||
                referencedSymbols(definition.value.body).some((next) => recursive(next, seen))
            : false;
        };
        if ([firstName, secondName].some((symbol) => recursive(symbol))) continue;
        const uses = references.get(name) ?? [];
        if (uses.length < 2) continue;
        if (
          !uses.every((use) => {
            const owner = enclosingRule(use);
            if (
              !owner ||
              owner === property ||
              owner.parent !== property.parent ||
              isRuleDisabled(context, owner)
            )
              return false;
            for (let current = use; current !== owner; current = current.parent) {
              if (isRuleDisabled(context, current)) return false;
              if (
                current.type === "CallExpression" &&
                (!["seq", "choice", "optional", "repeat", "repeat1", ...precedenceCalls].includes(
                  callName(current),
                ) ||
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
          "private-precedence-ordered-pair-inline",
          `${name} has ${uses.length} unaliased local uses of an ordered symbol pair under static precedence; try adding it to grammar.inline. Preserve the complete precedence chain, both symbol definitions, fields, aliases, alternative order and caller optionality. Check cross-file uses and metadata, then compare actions, table bytes, memory, parsing speed and complete valid and recovery trees before retaining the change.`,
        );
      }
    },
  };
}, "Suggest inlining multiply used private ordered symbol pairs with static precedence");
