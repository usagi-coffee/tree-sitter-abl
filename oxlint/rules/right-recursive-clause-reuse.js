import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  isStaticDsl,
  isStaticKeywordCall,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { projectPrecedenceSymbols, rootMetadataSymbols } from "../helpers/project-metadata.js";

export const rightRecursiveClauseReuse = rule((context) => {
  const properties = [],
    references = new Map(),
    restricted = rootMetadataSymbols(context, [
      "inline",
      "conflicts",
      "precedences",
      "supertypes",
      "externals",
      "extras",
      "word",
    ]);
  for (const name of projectPrecedenceSymbols(context)) restricted.add(name);
  let dynamicReference = false;
  const rightBody = (node) =>
    callName(node) === "prec.right" && node.arguments.length === 1 ? node.arguments[0] : null;
  const signature = (node) =>
    JSON.stringify(context.sourceCode.getTokens(node).map(({ type, value }) => [type, value]));
  const suppressed = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" && node.arguments.some(suppressed));
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      if (node.object.type !== "Identifier" || node.object.name !== "$") return;
      const name = memberName(node);
      if (!name) {
        dynamicReference = true;
        return;
      }
      const uses = references.get(name) ?? [];
      uses.push(node);
      references.set(name, uses);
      if (!enclosingRule(node)) restricted.add(name);
    },
    "Program:exit"() {
      if (dynamicReference) return;
      for (const head of properties) {
        const name = ruleName(head),
          body = head.value.body;
        if (
          !name.startsWith("__") ||
          restricted.has(name) ||
          isRuleDisabled(context, head) ||
          callName(body) !== "seq" ||
          body.arguments.length !== 2 ||
          !isStaticDsl(body) ||
          suppressed(body)
        )
          continue;
        const [prefix, suffix] = body.arguments,
          items = rightBody(suffix);
        if (
          (!memberName(prefix) &&
            !isStaticKeywordCall(prefix) &&
            !(prefix.type === "Literal" && typeof prefix.value === "string")) ||
          callName(items) !== "seq" ||
          items.arguments.length !== 2
        )
          continue;
        const [item, continuation] = items.arguments;
        if (
          !memberName(item) ||
          callName(continuation) !== "optional" ||
          continuation.arguments.length !== 1
        )
          continue;
        const recursiveName = memberName(continuation.arguments[0]),
          recursive = properties.find(
            (property) => property.parent === head.parent && ruleName(property) === recursiveName,
          );
        if (
          !recursiveName?.startsWith("__") ||
          recursiveName === name ||
          restricted.has(recursiveName) ||
          !recursive ||
          isRuleDisabled(context, recursive) ||
          suppressed(recursive.value.body) ||
          [memberName(prefix), memberName(item)].some((part) =>
            [name, recursiveName].includes(part),
          )
        )
          continue;
        const recursiveBody = rightBody(recursive.value.body);
        if (
          callName(recursiveBody) !== "seq" ||
          recursiveBody.arguments.length !== 3 ||
          ![prefix, item, continuation].every(
            (part, index) => signature(part) === signature(recursiveBody.arguments[index]),
          )
        )
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length < 2) continue;
        if (
          !uses.every((use) => {
            const owner = enclosingRule(use);
            if (
              !owner ||
              owner === head ||
              owner === recursive ||
              owner.parent !== head.parent ||
              restricted.has(ruleName(owner)) ||
              isRuleDisabled(context, owner)
            )
              return false;
            let rightAssociative = false;
            for (let current = use; current !== owner; current = current.parent) {
              if (isRuleDisabled(context, current)) return false;
              const parent = current.parent;
              if (parent.type !== "CallExpression") continue;
              if (!isStaticDsl(parent)) return false;
              if (rightBody(parent) === current) rightAssociative = true;
              else if (callName(parent) !== "seq" || parent.arguments.at(-1) !== current)
                return false;
            }
            return rightAssociative;
          })
        )
          continue;
        report(
          context,
          head,
          "right-recursive-clause-reuse",
          `${name} duplicates the complete sequence of right-recursive ${recursiveName}, with matching unnamed right associativity on its suffix and ${uses.length} callers. Try reusing ${recursiveName} at those callers and removing the entry helper. Preserve the prefix, item, optional recursion, fields, aliases and caller associativity; check cross-file references and metadata, then compare actions, table bytes, memory, parsing speed and complete valid and recovery trees before retaining the change.`,
        );
      }
    },
  };
}, "Suggest reusing complete right-recursive clauses from compatible right-associative entry helpers");
