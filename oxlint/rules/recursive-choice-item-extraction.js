import {
  callName,
  collectRules,
  isNullable,
  isRuleDisabled,
  isStaticDsl,
  memberName,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const recursiveChoiceItemExtraction = rule(
  collectRules((context, properties) => {
    for (const property of properties) {
      const name = ruleName(property);
      if (!name.startsWith("_") || isRuleDisabled(context, property)) continue;
      let body = property.value.body;
      while (["prec", "prec.left", "prec.right"].includes(callName(body))) {
        if (!body.arguments.slice(0, -1).every((argument) => argument.type === "Literal")) break;
        body = body.arguments.at(-1);
      }
      if (callName(body) !== "seq" || body.arguments.length !== 2 || !isStaticDsl(body)) continue;
      const [item, tail] = body.arguments;
      if (
        callName(item) !== "choice" ||
        item.arguments.length < 2 ||
        !item.arguments.some((alternative) => callName(alternative) === "seq") ||
        item.arguments.some((alternative) => isNullable(alternative)) ||
        referencedSymbols(item).includes(name) ||
        callName(tail) !== "optional" ||
        tail.arguments.length !== 1 ||
        memberName(tail.arguments[0]) !== name ||
        isRuleDisabled(context, body) ||
        isRuleDisabled(context, item)
      )
        continue;
      report(
        context,
        property,
        "recursive-choice-item-extraction",
        `${name} repeats a compound choice before optional self-recursion; try extracting the choice into a hidden item helper. Keep the list's precedence wrapper and continuation in place, preserve alternatives and fields, then measure parser size and validate trees.`,
      );
    }
  }),
  "Suggest extracting compound choice items from hidden direct recursive sequences",
);
