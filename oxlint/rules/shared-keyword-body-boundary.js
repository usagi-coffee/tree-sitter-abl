import {
  callName,
  dslSignature,
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
import {
  keywordInlineSymbols,
  projectPrecedenceSymbols,
  rootMetadataSymbols,
  usedOutsideFile,
} from "../helpers/project-metadata.js";

const metadata = [
  "inline",
  "conflicts",
  "precedences",
  "supertypes",
  "externals",
  "extras",
  "word",
];
const isCall = (node, name, length) => callName(node) === name && node.arguments.length === length;
const optionalSymbol = (node) =>
  isCall(node, "optional", 1) ? memberName(node.arguments[0]) : null;
const isPrivate = (name) => name?.startsWith("__");

function fieldSymbol(node) {
  if (!isCall(node, "field", 2)) return null;
  const [name, value] = node.arguments;
  return name.type === "Literal" && typeof name.value === "string" && name.value
    ? memberName(value)
    : null;
}

function assignmentRules(body, opener, localRules, inlined) {
  if (!isCall(body, "seq", 5) || !isStaticDsl(body)) return null;
  const [target, separator, item, list, filter] = body.arguments;
  const targetType = fieldSymbol(target);
  const separatorName = memberName(separator);
  const listName = optionalSymbol(list);
  if (
    !targetType?.startsWith("_") ||
    isPrivate(targetType) ||
    !separatorName?.startsWith("_kw_") ||
    separatorName === opener ||
    !inlined.has(separatorName) ||
    !isCall(item, "alias", 2) ||
    !isPrivate(listName) ||
    !isPrivate(optionalSymbol(filter))
  )
    return null;

  const [source, alias] = item.arguments.map(memberName);
  if (!isPrivate(source) || !alias || alias.startsWith("_")) return null;
  const assignment = localRules.get(source);
  const continuation = localRules.get(listName);
  if (!isCall(assignment?.value.body, "seq", 2) || !isCall(continuation?.value.body, "seq", 3))
    return null;
  const [column, value] = assignment.value.body.arguments;
  const [comma, repeatedItem, next] = continuation.value.body.arguments;
  if (
    fieldSymbol(column) !== targetType ||
    memberName(value) !== "_equals_value" ||
    comma.type !== "Literal" ||
    comma.value !== "," ||
    !isStaticDsl(repeatedItem) ||
    dslSignature(repeatedItem) !== dslSignature(item) ||
    optionalSymbol(next) !== listName
  )
    return null;
  return [assignment, continuation];
}

export const sharedKeywordBodyBoundary = rule((context) => {
  const properties = [];
  const references = new Map();
  let dynamicReference = false;
  const suppressed = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" && node.arguments.some(suppressed));

  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      if (node.object.type !== "Identifier" || node.object.name !== "$") return;
      const name = memberName(node) ?? (node.computed ? node.property.value : null);
      if (typeof name !== "string") {
        dynamicReference = true;
        return;
      }
      const uses = references.get(name) ?? [];
      uses.push(node);
      references.set(name, uses);
    },
    "Program:exit"() {
      if (dynamicReference) return;
      let inlined;
      let restricted;
      for (const owner of properties) {
        const ownerName = ruleName(owner);
        const caller = owner.value.body;
        if (ownerName.startsWith("_") || !isCall(caller, "seq", 3)) continue;
        const [opener, use, terminator] = caller.arguments;
        const keyword = memberName(opener);
        const name = memberName(use);
        if (
          !keyword?.startsWith("_kw_") ||
          !isPrivate(name) ||
          !name.endsWith("_body") ||
          memberName(terminator) !== "_terminator" ||
          references.get(name)?.length !== 1 ||
          owner.parent.properties.some((entry) => entry.type === "SpreadElement" || entry.computed)
        )
          continue;
        inlined ??= keywordInlineSymbols(context);
        if (!inlined.has(keyword)) continue;

        const localRules = new Map(
          properties
            .filter((property) => property.parent === owner.parent)
            .map((property) => [ruleName(property), property]),
        );
        const definition = localRules.get(name);
        const body = definition?.value.body;
        const assignments = assignmentRules(body, keyword, localRules, inlined);
        if (
          !assignments ||
          [
            owner,
            caller,
            definition,
            body,
            ...assignments,
            ...assignments.map((rule) => rule.value.body),
          ].some(suppressed) ||
          (references.get(ownerName) ?? []).some((reference) => !enclosingRule(reference))
        )
          continue;

        restricted ??= new Set([
          ...rootMetadataSymbols(context, metadata),
          ...projectPrecedenceSymbols(context),
        ]);
        if (restricted.has(name) || restricted.has(ownerName) || usedOutsideFile(context, name))
          continue;

        const seen = new Set();
        const recursiveOrDynamic = (symbol) => {
          if (symbol === name || symbol === ownerName) return true;
          if (seen.has(symbol)) return false;
          seen.add(symbol);
          const dependency = localRules.get(symbol)?.value.body;
          return (
            dependency &&
            (!isStaticDsl(dependency) || referencedSymbols(dependency).some(recursiveOrDynamic))
          );
        };
        if ([keyword, ...referencedSymbols(body)].some(recursiveOrDynamic)) continue;

        report(
          context,
          opener,
          "shared-keyword-body-boundary",
          `${ownerName} puts ${keyword} before the sole use of ${name}. Try moving the shared keyword into the retained assignment body. Preserve the terminator, target field, distinguishing keyword and assignment list, then compare parser metrics, parsing speed and complete valid and recovery trees.`,
        );
      }
    },
  };
}, "Suggest moving a leading shared keyword into its single-use assignment body");
