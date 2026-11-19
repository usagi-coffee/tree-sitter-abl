import {
  callName,
  collectRules,
  isRuleDisabled,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { projectPrecedenceSymbols, rootMetadataSymbols } from "../helpers/project-metadata.js";

const isCall = (node, name, length) => callName(node) === name && node.arguments.length === length;
const literal = (node, value) => node?.type === "Literal" && node.value === value;
const keyword = (node, value) => isCall(node, "kw", 1) && literal(node.arguments[0], value);
const optional = (node) => (isCall(node, "optional", 1) ? node.arguments[0] : null);

function parameterList(body, name) {
  if (!isCall(body, "seq", 2)) return false;
  const [item, next] = body.arguments;
  const itemName = memberName(item);
  const continuation = optional(next);
  return (
    itemName?.startsWith("__") &&
    itemName !== name &&
    isCall(continuation, "seq", 2) &&
    literal(continuation.arguments[0], ",") &&
    memberName(continuation.arguments[1]) === name
  );
}

function signatureParameters(signature, delegate) {
  if (!isCall(signature, "seq", 5) || !isCall(delegate, "seq", 3)) return null;
  const [marker, result, open, parameters, close] = signature.arguments;
  const [kind, classMarker, delegateType] = delegate.arguments;
  if (
    !keyword(optional(marker), "SIGNATURE") ||
    memberName(result) !== "_kw_void" ||
    !literal(open, "(") ||
    !literal(close, ")") ||
    !keyword(kind, "DELEGATE") ||
    memberName(optional(classMarker)) !== "_kw_class" ||
    !isCall(delegateType, "field", 2) ||
    !literal(delegateType.arguments[0], "delegate_type") ||
    memberName(delegateType.arguments[1]) !== "_type_or_string"
  )
    return null;
  return memberName(optional(parameters));
}

export const parenthesizedSignatureExtraction = rule(
  collectRules((context, properties) => {
    const suppressed = (node) =>
      isRuleDisabled(context, node) ||
      (node.type === "CallExpression" && node.arguments.some(suppressed));
    let restricted;
    for (const owner of properties) {
      const name = ruleName(owner);
      const body = owner.value.body;
      if (!name.startsWith("__") || !isCall(body, "choice", 2)) continue;

      const [signature, delegate] = body.arguments;
      const parameters = signatureParameters(signature, delegate);
      if (!parameters?.startsWith("__") || name === parameters) continue;
      const local = properties.filter((property) => property.parent === owner.parent);
      const lists = local.filter((property) => ruleName(property) === parameters);
      if (
        lists.length !== 1 ||
        !parameterList(lists[0].value.body, parameters) ||
        local.some((property) => property !== owner && ruleName(property) === name) ||
        owner.parent.properties.some((entry) => entry.type === "SpreadElement" || entry.computed) ||
        [owner, body, lists[0], lists[0].value.body].some(suppressed)
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
      if (restricted.has(name) || restricted.has(parameters)) continue;

      report(
        context,
        signature.arguments[2],
        "parenthesized-signature-extraction",
        "Try extracting the parentheses and optional parameter list into one private rule. Keep the signature and return keywords, delegate alternative, and recursive parameters unchanged, then compare parser metrics, speed, and complete valid and recovery trees.",
      );
    }
  }),
  "Suggest extracting parenthesized parameter clauses from signature alternatives",
);
