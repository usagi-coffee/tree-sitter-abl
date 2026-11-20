import {
  callName,
  collectRules,
  isRuleDisabled,
  isRuleProperty,
  isStaticDsl,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { projectPrecedenceSymbols, rootMetadataSymbols } from "../helpers/project-metadata.js";

const isCall = (node, name, length) => callName(node) === name && node.arguments.length === length;
const literal = (node, value) => node?.type === "Literal" && node.value === value;
const optionalValue = (node) => (isCall(node, "optional", 1) ? node.arguments[0] : null);

function fieldValue(node, name) {
  return isCall(node, "field", 2) && literal(node.arguments[0], name)
    ? memberName(node.arguments[1])
    : null;
}

function persistentRunInPhrase(arm) {
  if (!isCall(arm, "seq", 7)) return null;
  const [persistent, run, procedure, first, context, last, end] = arm.arguments;
  const alias = optionalValue(context);
  if (
    !isCall(persistent, "kw", 1) ||
    !literal(persistent.arguments[0], "PERSISTENT") ||
    memberName(run) !== "_kw_run" ||
    fieldValue(procedure, "procedure") !== "identifier" ||
    memberName(optionalValue(first)) !== "arguments" ||
    !isCall(alias, "alias", 2) ||
    memberName(alias.arguments[1]) !== "in_phrase" ||
    memberName(optionalValue(last)) !== "arguments" ||
    memberName(end) !== "_terminator"
  )
    return null;
  return memberName(alias.arguments[0]);
}

function isInContext(body) {
  return (
    isCall(body, "seq", 2) &&
    memberName(body.arguments[0]) === "_kw_in" &&
    fieldValue(body.arguments[1], "context")?.startsWith("__")
  );
}

export const persistentRunSuffixExtraction = rule(
  collectRules((context, properties) => {
    const suppressed = (node) =>
      isRuleDisabled(context, node) ||
      (node.type === "CallExpression" && node.arguments.some(suppressed));
    let restricted;

    for (const owner of properties) {
      const name = ruleName(owner);
      const body = owner.value.body;
      if (
        !name.startsWith("__") ||
        callName(body) !== "choice" ||
        isRuleDisabled(context, owner) ||
        isRuleDisabled(context, body)
      )
        continue;

      for (const arm of body.arguments) {
        const phrase = persistentRunInPhrase(arm);
        if (!phrase?.startsWith("__") || phrase === name || suppressed(arm)) continue;

        const map = owner.parent.properties;
        if (
          map.some((entry) => entry.type === "SpreadElement" || entry.computed) ||
          !isStaticDsl(body) ||
          map.some((entry) => ruleName(entry) === "arguments") ||
          map.filter((entry) => ruleName(entry) === name).length !== 1
        )
          continue;

        const definitions = map.filter((entry) => ruleName(entry) === phrase);
        const [definition] = definitions;
        if (
          definitions.length !== 1 ||
          !isRuleProperty(definition) ||
          !isInContext(definition.value.body) ||
          isRuleDisabled(context, definition) ||
          suppressed(definition.value.body)
        )
          continue;

        restricted ??= new Set([
          ...rootMetadataSymbols(context, [
            "inline",
            "conflicts",
            "supertypes",
            "externals",
            "extras",
            "word",
          ]),
          ...projectPrecedenceSymbols(context),
        ]);
        if (restricted.has(name) || restricted.has(phrase)) continue;

        report(
          context,
          arm.arguments[3],
          "persistent-run-suffix-extraction",
          "Try extracting the PERSISTENT RUN arguments and IN phrase into a nonempty private suffix. Keep the suffix optional and preserve up to two argument lists without IN or one on each side of IN. Keep the phrase alias, procedure field, keywords, precedence, and terminator in place. Compare parser metrics, parsing speed, and complete valid and recovery trees.",
        );
      }
    }
  }),
  "Suggest extracting the optional PERSISTENT RUN argument and IN suffix",
);
