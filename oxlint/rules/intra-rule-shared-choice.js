import {
  callName,
  enclosingRule,
  isNullable,
  isRuleDisabled,
  isStaticDsl,
  referencedSymbols,
  report,
  rule,
  ruleName,
  unwrap,
} from "../helpers.js";

export const intraRuleSharedChoice = rule((context) => {
  const choices = new Map();
  const hasDynamicPrecedence = (node) =>
    callName(node) === "prec.dynamic" ||
    (node?.type === "CallExpression" && node.arguments.some(hasDynamicPrecedence));
  const nullable = (node) => {
    const body = unwrap(node),
      name = callName(body);
    if (name === "field") return nullable(body.arguments[1]);
    if (name === "alias" || name === "repeat1") return nullable(body.arguments[0]);
    if (name === "seq") return body.arguments.every(nullable);
    if (name === "choice") return body.arguments.some(nullable);
    return isNullable(body);
  };
  return {
    CallExpression(node) {
      if (
        callName(node) !== "choice" ||
        node.arguments.length < 2 ||
        !isStaticDsl(node) ||
        nullable(node) ||
        hasDynamicPrecedence(node)
      )
        return;
      const property = enclosingRule(node);
      if (!property || isRuleDisabled(context, property) || isRuleDisabled(context, node)) return;
      for (let parent = node.parent; parent !== property; parent = parent.parent) {
        if (["alias", "token", "token.immediate", "prec.dynamic"].includes(callName(parent)))
          return;
      }
      let subject = node;
      while (
        ["prec", "prec.left", "prec.right"].includes(callName(subject.parent)) &&
        subject.parent.arguments.at(-1) === subject
      )
        subject = subject.parent;
      if (
        !isStaticDsl(subject) ||
        isRuleDisabled(context, subject) ||
        referencedSymbols(subject).includes(ruleName(property))
      )
        return;
      const signature = JSON.stringify(
        context.sourceCode.getTokens(subject).map(({ type, value }) => [type, value]),
      );
      let occurrences = choices.get(property);
      if (!occurrences) {
        occurrences = new Map();
        choices.set(property, occurrences);
      }
      const start = context.sourceCode.getRange(subject)[0];
      const previous = occurrences.get(signature);
      if (!previous) {
        occurrences.set(signature, { start, line: subject.loc.start.line, reported: false });
        return;
      }
      if (previous.start === start || previous.reported) return;
      previous.reported = true;
      report(
        context,
        subject,
        "intra-rule-shared-choice",
        `${ruleName(property)} repeats this exact choice of ${node.arguments.length} alternatives in the same rule (first at line ${previous.line}); try extracting one private non-nullable choice helper. Keep caller fields, aliases and precedence wrappers in place, preserve alternative order and token identity, check metadata, then measure parser counts and bytes and validate trees.`,
      );
    },
  };
}, "Suggest sharing exact non-nullable choices repeated within one grammar rule");
