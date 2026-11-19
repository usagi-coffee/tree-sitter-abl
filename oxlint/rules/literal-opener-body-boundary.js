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
import {
  projectPrecedenceSymbols,
  rootMetadataSymbols,
  usedOutsideFile,
} from "../helpers/project-metadata.js";

const delimiters = { "(": ")", "[": "]", "{": "}" };
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
const isLiteral = (node, value) => node?.type === "Literal" && node.value === value;
const optionalValue = (node) => (isCall(node, "optional", 1) ? node.arguments[0] : null);

function aliasesPrivateSymbol(node) {
  if (!isCall(node, "alias", 2)) return false;
  const source = memberName(node.arguments[0]);
  const target = memberName(node.arguments[1]);
  return source?.startsWith("__") && target && !target.startsWith("_");
}

function hasAliasedNameAndClause(body) {
  if (!isCall(body, "seq", 2)) return false;
  const [name, tail] = body.arguments;
  if (
    !isCall(name, "field", 2) ||
    !isLiteral(name.arguments[0], "name") ||
    !aliasesPrivateSymbol(name.arguments[1])
  )
    return false;
  const clause = optionalValue(tail);
  if (!isCall(clause, "seq", 3)) return false;
  const [open, content, close] = clause.arguments;
  return (
    open.type === "Literal" &&
    Object.hasOwn(delimiters, open.value) &&
    isLiteral(close, delimiters[open.value]) &&
    aliasesPrivateSymbol(optionalValue(content))
  );
}

export const literalOpenerBodyBoundary = rule((context) => {
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
      for (const owner of properties) {
        const ownerName = ruleName(owner);
        const caller = owner.value.body;
        if (ownerName.startsWith("_") || !isCall(caller, "seq", 3)) continue;
        const [opener, use, terminator] = caller.arguments;
        const name = memberName(use);
        if (
          !isLiteral(opener, "@") ||
          !name?.startsWith("__") ||
          !name.endsWith("_body") ||
          memberName(terminator) !== "_terminator" ||
          references.get(name)?.length !== 1 ||
          owner.parent.properties.some((entry) => entry.type === "SpreadElement" || entry.computed)
        )
          continue;

        const localRules = new Map(
          properties
            .filter((property) => property.parent === owner.parent)
            .map((property) => [ruleName(property), property]),
        );
        const property = localRules.get(name);
        const body = property?.value.body;
        if (
          !hasAliasedNameAndClause(body) ||
          [owner, property, caller, body].some(suppressed) ||
          (references.get(ownerName) ?? []).some((reference) => !enclosingRule(reference))
        )
          continue;

        const restricted = rootMetadataSymbols(context, metadata);
        for (const symbol of projectPrecedenceSymbols(context)) restricted.add(symbol);
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
        if (referencedSymbols(body).some(recursiveOrDynamic)) continue;

        report(
          context,
          opener,
          "literal-opener-body-boundary",
          `${ownerName} puts a literal opener before the sole use of ${name}. Try moving that opener into the retained private body. Preserve the terminator, name field and optional aliased clause, then compare parser metrics, parsing speed and complete valid and recovery trees.`,
        );
      }
    },
  };
}, "Suggest moving a literal opener into its single-use aliased name and clause body");
