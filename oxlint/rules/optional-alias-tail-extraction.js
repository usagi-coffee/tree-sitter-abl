import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  isStaticDsl,
  isStaticKeywordCall,
  memberName,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { projectPrecedenceSymbols, rootMetadataSymbols } from "../helpers/project-metadata.js";

export const optionalAliasTailExtraction = rule((context) => {
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
  const keyword = (node) => isStaticKeywordCall(node) || memberName(node)?.startsWith("_kw_");
  const unsafe = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" &&
      (["token", "token.immediate", "prec", "prec.left", "prec.right", "prec.dynamic"].includes(
        callName(node),
      ) ||
        node.arguments.some(unsafe)));
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
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (
          !name.startsWith("__") ||
          restricted.has(name) ||
          isRuleDisabled(context, property) ||
          callName(body) !== "seq" ||
          !keyword(body.arguments[0]) ||
          !isStaticDsl(body) ||
          unsafe(body)
        )
          continue;
        const prefix = body.arguments.slice(0, -1),
          suffix = body.arguments.at(-1);
        if (
          prefix.filter((part) => callName(part) === "optional" && part.arguments.length === 1)
            .length < 2 ||
          callName(suffix) !== "optional" ||
          suffix.arguments.length !== 1
        )
          continue;
        const tail = suffix.arguments[0];
        if (
          callName(tail) !== "choice" ||
          tail.arguments.length !== 2 ||
          !tail.arguments.every(
            (branch) =>
              callName(branch) === "alias" &&
              branch.arguments.length === 2 &&
              memberName(branch.arguments[1]) &&
              !memberName(branch.arguments[1]).startsWith("_"),
          ) ||
          memberName(tail.arguments[0].arguments[1]) === memberName(tail.arguments[1].arguments[1])
        )
          continue;
        const sources = tail.arguments.map((branch) => branch.arguments[0]);
        if (sources.filter(keyword).length !== 1) continue;
        const phraseName = memberName(sources.find((source) => !keyword(source))),
          localRules = new Map(
            properties
              .filter((candidate) => candidate.parent === property.parent)
              .map((candidate) => [ruleName(candidate), candidate]),
          ),
          phrase = localRules.get(phraseName),
          phraseBody = phrase?.value.body;
        if (
          !phraseName?.startsWith("__") ||
          restricted.has(phraseName) ||
          !phrase ||
          isRuleDisabled(context, phrase) ||
          callName(phraseBody) !== "seq" ||
          phraseBody.arguments.length < 2 ||
          !keyword(phraseBody.arguments[0]) ||
          !isStaticDsl(phraseBody) ||
          unsafe(phraseBody)
        )
          continue;
        const recursive = (symbol, active = new Set()) => {
          if (!localRules.has(symbol)) return false;
          if (active.has(symbol)) return true;
          const next = new Set(active).add(symbol);
          return referencedSymbols(localRules.get(symbol).value.body).some((child) =>
            recursive(child, next),
          );
        };
        if (recursive(name)) continue;
        const uses = references.get(name) ?? [];
        if (
          uses.length === 0 ||
          !uses.every((use) => {
            const owner = enclosingRule(use);
            if (
              !owner ||
              owner.parent !== property.parent ||
              isRuleDisabled(context, owner) ||
              isRuleDisabled(context, use)
            )
              return false;
            for (let parent = use.parent; parent !== owner; parent = parent.parent) {
              if (
                isRuleDisabled(context, parent) ||
                (parent.type === "CallExpression" &&
                  !["seq", "choice", "optional", "repeat", "repeat1"].includes(callName(parent)))
              )
                return false;
            }
            return true;
          })
        )
          continue;
        report(
          context,
          tail,
          "optional-alias-tail-extraction",
          `${name} ends with an optional choice between a named keyword flag and a named compound phrase after multiple optional clauses; try extracting the complete nonempty choice into a hidden helper, leaving optionality at its current site. Preserve every source rule, alias, field, keyword option and alternative order; check external uses and metadata, prioritize LARGE_STATE_COUNT before ACTION_COUNT, and compare complete valid and recovery trees.`,
        );
      }
    },
  };
}, "Suggest extracting optional mixed flag and compound-phrase alias choices at sequence tails");
