import {
  callName,
  collectRules,
  isRuleDisabled,
  isStaticDsl,
  memberName,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const recursiveItemExtraction = rule(
  collectRules((context, properties) => {
    for (const property of properties) {
      const name = ruleName(property),
        body = property.value.body;
      if (!name.startsWith("_") || callName(body) !== "seq" || body.arguments.length < 3) continue;
      if (!isStaticDsl(body) || isRuleDisabled(context, property) || isRuleDisabled(context, body))
        continue;
      const tail = body.arguments.at(-1),
        item = body.arguments.slice(0, -1),
        first = item[0];
      if (
        callName(tail) !== "optional" ||
        tail.arguments.length !== 1 ||
        memberName(tail.arguments[0]) !== name ||
        callName(first) !== "field" ||
        first.arguments.length !== 2 ||
        !memberName(first.arguments[1]) ||
        !item.some((part) => callName(part) === "optional") ||
        item.some((part) => referencedSymbols(part).includes(name))
      )
        continue;
      report(
        context,
        property,
        "recursive-item-extraction",
        `${name} repeats a compound field item before optional self-recursion; try extracting that non-empty item into a hidden helper. Preserve fields, aliases, option order and the recursive continuation, check metadata, then measure parser size and validate trees.`,
      );
    }
  }),
  "Suggest extracting compound field items from hidden direct recursive sequences",
);
