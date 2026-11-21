import {
  callName,
  collectRules,
  enclosingRule,
  isNullable,
  isRuleDisabled,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { usedOutsideFile } from "../helpers/project-metadata.js";

function rightSequence(node) {
  if (callName(node) !== "prec.right") return null;
  const [first, second] = node.arguments;
  const named =
    node.arguments.length === 2 &&
    first.type === "Literal" &&
    ["string", "number"].includes(typeof first.value);
  if (node.arguments.length !== 1 && !named) return null;
  const sequence = named ? second : first;
  return callName(sequence) === "seq" ? sequence : null;
}

function checkRequiredTail(context, head, properties, references) {
  const headName = ruleName(head);
  const body = rightSequence(head.value.body);
  if (!body || body.arguments.length !== 2 || isRuleDisabled(context, body)) return;
  const [item, tailUse] = body.arguments;
  const itemName = memberName(item);
  const tailName = memberName(tailUse);
  if (!itemName || !tailName?.startsWith("_") || new Set([itemName, headName, tailName]).size !== 3)
    return;

  const tail = properties.find(
    (property) => property.parent === head.parent && ruleName(property) === tailName,
  );
  const tailBody = tail && rightSequence(tail.value.body);
  if (
    !tailBody ||
    tailBody.arguments.length !== 3 ||
    head.value.body.arguments.length !== tail.value.body.arguments.length ||
    (head.value.body.arguments.length === 2 &&
      head.value.body.arguments[0].value !== tail.value.body.arguments[0].value) ||
    isRuleDisabled(context, tail) ||
    isRuleDisabled(context, tailBody)
  )
    return;
  const [separator, nextItem, continuation] = tailBody.arguments;
  if (
    separator.type !== "Literal" ||
    typeof separator.value !== "string" ||
    separator.value.length === 0 ||
    memberName(nextItem) !== itemName ||
    callName(continuation) !== "optional" ||
    continuation.arguments.length !== 1 ||
    memberName(continuation.arguments[0]) !== tailName ||
    references.get(tailName)?.length !== 2
  )
    return;

  const uses = references.get(headName) ?? [];
  const use = uses[0];
  const alias = use?.parent;
  const owner = use && enclosingRule(use);
  if (
    uses.length !== 1 ||
    !owner ||
    owner.parent !== head.parent ||
    callName(alias) !== "alias" ||
    alias.arguments.length !== 2 ||
    alias.arguments[0] !== use ||
    !memberName(alias.arguments[1]) ||
    memberName(alias.arguments[1]).startsWith("_") ||
    isRuleDisabled(context, owner) ||
    isRuleDisabled(context, alias)
  )
    return;
  const choice = owner.value.body;
  if (
    callName(choice) !== "choice" ||
    choice.arguments.length !== 2 ||
    !choice.arguments.includes(alias) ||
    !choice.arguments.some((branch) => memberName(branch) === itemName) ||
    isRuleDisabled(context, choice) ||
    head.parent.properties.some(
      (property) => property.type === "SpreadElement" || property.computed,
    )
  )
    return;
  for (const property of [head, tail, owner]) {
    if (
      head.parent.properties.filter((entry) => ruleName(entry) === ruleName(property)).length !== 1
    )
      return;
  }
  if ([headName, tailName].some((name) => usedOutsideFile(context, name, { wholeName: true })))
    return;

  report(
    context,
    tail,
    "recursive-tail-reuse",
    `${tailName} consumes the separator, the same item as ${headName}, and an optional continuation. Try folding it into ${headName} as a required item and separator followed by a choice between the recursive head and a single item. Preserve the existing alias and right associativity, then compare parser metrics and valid and recovery trees.`,
  );
}

export const recursiveTailReuse = rule((context) => {
  const references = new Map();
  let computedReference = false;
  const rules = collectRules((context, properties) => {
    const signature = (node) =>
      JSON.stringify(context.sourceCode.getTokens(node).map(({ type, value }) => [type, value]));
    for (const head of properties) {
      const headName = ruleName(head);
      const body = head.value.body;
      if (!headName.startsWith("_") || isRuleDisabled(context, head)) continue;
      if (callName(body) === "prec.right" && !computedReference) {
        checkRequiredTail(context, head, properties, references);
        continue;
      }
      if (callName(body) !== "seq" || body.arguments.length < 2) continue;
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
  })(context);
  return {
    ...rules,
    MemberExpression(node) {
      if (node.object.type !== "Identifier" || node.object.name !== "$") return;
      const name = memberName(node);
      if (!name) {
        computedReference = true;
        return;
      }
      const uses = references.get(name) ?? [];
      uses.push(node);
      references.set(name, uses);
    },
  };
}, "Suggest folding separated recursive tails into their existing hidden list head");
