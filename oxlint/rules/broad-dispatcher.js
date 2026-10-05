import { callName, collectRules, memberName, report, rule, ruleName, unwrap } from "../helpers.js";

export const broadDispatcher = rule(
  collectRules((context, properties) => {
    for (const property of properties) {
      const name = ruleName(property);
      const body = unwrap(property.value.body);
      if (!name.startsWith("_") || callName(body) !== "choice" || body.arguments.length < 8)
        continue;
      if (!body.arguments.every((argument) => memberName(argument)?.startsWith("_"))) continue;
      report(
        context,
        property,
        "broad-dispatcher",
        "This broad hidden dispatcher may add specialization; measure local sharing before grouping it.",
      );
    }
  }),
  "Warn about broad hidden dispatchers",
);
