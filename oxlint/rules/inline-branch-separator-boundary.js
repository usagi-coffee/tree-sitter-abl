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
import {
  keywordInlineSymbols,
  projectPrecedenceSymbols,
  rootMetadataSymbols,
} from "../helpers/project-metadata.js";

export const inlineBranchSeparatorBoundary = rule((context) => {
  const inlined = keywordInlineSymbols(context),
    restricted = rootMetadataSymbols(context, [
      "conflicts",
      "precedences",
      "supertypes",
      "externals",
      "extras",
      "word",
    ]),
    definitions = new Map(),
    sequences = [];
  for (const name of projectPrecedenceSymbols(context)) restricted.add(name);
  let dynamicReference = false;
  const keyword = (node) => memberName(node)?.startsWith("_kw_") || isStaticKeywordCall(node);
  const unsafe = (node) =>
    isRuleDisabled(context, node) ||
    ["token", "token.immediate", "prec.dynamic"].includes(callName(node)) ||
    (node.type === "CallExpression" && node.arguments.some(unsafe));
  const branch = (node) => {
    if (
      callName(node) !== "field" ||
      node.arguments.length !== 2 ||
      node.arguments[0].type !== "Literal" ||
      typeof node.arguments[0].value !== "string" ||
      !node.arguments[0].value ||
      !memberName(node.arguments[1])?.startsWith("__")
    )
      return null;
    return { field: node.arguments[0].value, symbol: memberName(node.arguments[1]) };
  };
  return {
    Property(node) {
      if (isRuleProperty(node)) definitions.set(ruleName(node), node);
    },
    MemberExpression(node) {
      if (node.object.type !== "Identifier" || node.object.name !== "$") return;
      const name = memberName(node);
      if (!name) {
        dynamicReference = true;
        return;
      }
      const owner = enclosingRule(node);
      for (let parent = node.parent; parent && parent !== owner; parent = parent.parent) {
        if (
          ["alias", "field", "token", "token.immediate", "prec.dynamic"].includes(callName(parent))
        )
          restricted.add(name);
      }
    },
    CallExpression(node) {
      if (callName(node) === "seq" && enclosingRule(node)) sequences.push(node);
    },
    "Program:exit"() {
      if (dynamicReference) return;
      const reported = new Set();
      for (const sequence of sequences) {
        const owner = enclosingRule(sequence),
          parts = sequence.arguments;
        if (parts.length < 4 || !isStaticDsl(sequence) || unsafe(sequence)) continue;
        const first = branch(parts.at(-2)),
          tail = parts.at(-1);
        if (
          !first ||
          !keyword(parts.at(-3)) ||
          callName(tail) !== "optional" ||
          tail.arguments.length !== 1
        )
          continue;
        const alternative = tail.arguments[0];
        if (callName(alternative) !== "seq" || alternative.arguments.length !== 2) continue;
        const [separator, value] = alternative.arguments,
          name = memberName(separator),
          second = branch(value),
          definition = definitions.get(name);
        if (
          !name?.startsWith("_kw_") ||
          !inlined.has(name) ||
          restricted.has(name) ||
          reported.has(name) ||
          name === memberName(parts.at(-3)) ||
          !second ||
          first.symbol !== second.symbol ||
          first.field === second.field ||
          first.symbol === ruleName(owner) ||
          (definition &&
            (!isStaticKeywordCall(definition.value.body) ||
              isRuleDisabled(context, definition) ||
              unsafe(definition.value.body)))
        )
          continue;
        let safe = !isRuleDisabled(context, owner);
        for (let parent = sequence.parent; parent !== owner; parent = parent.parent) {
          if (
            isRuleDisabled(context, parent) ||
            (parent.type === "CallExpression" &&
              (![
                "seq",
                "choice",
                "optional",
                "repeat",
                "repeat1",
                "prec",
                "prec.left",
                "prec.right",
              ].includes(callName(parent)) ||
                !isStaticDsl(parent)))
          )
            safe = false;
        }
        if (!safe) continue;
        report(
          context,
          separator,
          "inline-branch-separator-boundary",
          `${name} expands between required and optional fields of the same branch rule; try removing its inline entry to retain the existing keyword boundary. Preserve the branch fields, optionality, keyword options, token identities and precedence. Check every cross-file caller, aliases and metadata, then compare actions, table bytes, memory, parsing speed and complete valid and recovery trees before retaining the change.`,
        );
        reported.add(name);
      }
    },
  };
}, "Suggest retaining keyword boundaries before optional matching branches");
