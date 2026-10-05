import {
  callName,
  collectRules,
  isNullable,
  isRuleDisabled,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";

export const recursiveTailReuse = rule(
  collectRules((context, properties) => {
    const signature = (node) =>
      JSON.stringify(context.sourceCode.getTokens(node).map(({ type, value }) => [type, value]));
    for (const head of properties) {
      const headName = ruleName(head);
      const body = head.value.body;
      if (!headName.startsWith("_") || callName(body) !== "seq" || body.arguments.length < 2)
        continue;
      if (isRuleDisabled(context, head)) continue;
      const last = body.arguments.at(-1);
      if (callName(last) !== "optional" || last.arguments.length !== 1) continue;
      const tailName = memberName(last.arguments[0]);
      if (!tailName?.startsWith("_") || tailName === headName) continue;
      if (body.arguments.slice(0, -1).every((element) => isNullable(element))) continue;
      const tail = properties.find(
        (property) => property.parent === head.parent && ruleName(property) === tailName,
      );
      if (!tail || callName(tail.value.body) !== "seq" || isRuleDisabled(context, tail)) continue;
      const elements = tail.value.body.arguments;
      if (elements.length <= body.arguments.length) continue;
      const suffix = elements.slice(-body.arguments.length);
      if (
        !body.arguments.every((element, index) => signature(element) === signature(suffix[index]))
      )
        continue;
      report(
        context,
        tail,
        "recursive-tail-reuse",
        `${tailName} repeats the body of ${headName} after its separator. Try replacing that suffix with $.${headName}, keeping the separator unchanged; measure parser size and validate trees.`,
      );
    }
  }),
  "Suggest folding duplicated item/optional-tail bodies into their existing hidden list head",
);
