import {
  callName,
  collectRules,
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
import { rootMetadataSymbols } from "../helpers/project-metadata.js";

const ruleId = "required-clause-selector-extraction";
const isCall = (node, name, arity) => callName(node) === name && node.arguments.length === arity;
const staticKeyword = (node) => isStaticKeywordCall(node) && Boolean(node.arguments[0].value);
const keyword = (node) => staticKeyword(node) || memberName(node)?.startsWith("_kw_");
const namedField = (node) =>
  isCall(node, "field", 2) &&
  node.arguments[0].type === "Literal" &&
  typeof node.arguments[0].value === "string" &&
  Boolean(node.arguments[0].value) &&
  Boolean(memberName(node.arguments[1]));

function publicAlias(node) {
  if (!isCall(node, "alias", 2)) return null;
  const name = memberName(node.arguments[1]);
  return name && !name.startsWith("_") ? name : null;
}

function localClause(local, source, stem) {
  const name = memberName(source);
  if (!name?.startsWith(`__${stem}_`)) return null;
  const definition = local.get(name);
  const body = definition?.value.body;
  if (!isCall(body, "seq", 2) || !keyword(body.arguments[0]) || !namedField(body.arguments[1]))
    return null;
  return definition;
}

export const requiredClauseSelectorExtraction = rule(
  collectRules((context, properties) => {
    const suppressed = (node) =>
      isRuleDisabled(context, node) ||
      (node.type === "CallExpression" && node.arguments.some(suppressed));
    for (const owner of properties) {
      const name = ruleName(owner);
      const sequence = owner.value.body;
      if (
        !name.startsWith("__") ||
        !name.endsWith("_prefix") ||
        callName(sequence) !== "seq" ||
        sequence.arguments.length < 4 ||
        !keyword(sequence.arguments[0]) ||
        !isStaticDsl(sequence)
      )
        continue;

      const [value, selector, tail] = sequence.arguments.slice(-3);
      if (!namedField(value) || !isCall(selector, "choice", 2) || !isCall(tail, "optional", 1))
        continue;

      const [first, second] = selector.arguments;
      const [optionalClause] = tail.arguments;
      const aliases = [first, second, optionalClause].map(publicAlias);
      if (aliases.some((alias) => !alias) || new Set(aliases).size !== aliases.length) continue;

      const [flag, clause] = staticKeyword(first.arguments[0]) ? [first, second] : [second, first];
      if (!staticKeyword(flag.arguments[0])) continue;

      const entries = owner.parent.properties;
      if (
        entries.some(
          (entry) =>
            !isRuleProperty(entry) ||
            entry.computed ||
            entry.value.async ||
            entry.value.params.length !== 1 ||
            !isStaticDsl(entry.value.body),
        )
      )
        continue;
      const local = new Map(entries.map((entry) => [ruleName(entry), entry]));
      if (local.size !== entries.length) continue;

      const stem = name.slice(2, -"_prefix".length);
      const required = localClause(local, clause.arguments[0], stem);
      const optional = localClause(local, optionalClause.arguments[0], stem);
      const statement = local.get(`${stem}_statement`);
      const statementBody = statement?.value.body;
      if (
        !required ||
        !optional ||
        required === optional ||
        !isCall(statementBody, "seq", 2) ||
        memberName(statementBody.arguments[0]) !== name ||
        !["_terminator", "_no_error_terminator"].includes(memberName(statementBody.arguments[1]))
      )
        continue;

      const references = entries.flatMap((entry) => referencedSymbols(entry.value.body));
      if (references.filter((reference) => reference === name).length !== 1) continue;
      const clauseValues = [required, optional].map((entry) =>
        memberName(entry.value.body.arguments[1].arguments[1]),
      );
      if (
        clauseValues.some((reference) => local.has(reference)) ||
        [
          owner,
          sequence,
          value,
          selector,
          tail,
          required,
          required.value.body,
          optional,
          optional.value.body,
          statement,
          statementBody,
        ].some(suppressed)
      )
        continue;

      const restricted = rootMetadataSymbols(context, [
        "inline",
        "conflicts",
        "supertypes",
        "externals",
        "extras",
      ]);
      if ([name, ruleName(required), ruleName(optional)].some((symbol) => restricted.has(symbol)))
        continue;

      report(
        context,
        selector,
        ruleId,
        `Try extracting only the required clause and keyword choice in ${name} into a hidden selector. Keep the preceding field and following optional clause at their current use. Preserve both aliases, keyword options, alternative order, and precedence. Compare parser metrics, parsing speed, and complete valid and recovery trees.`,
      );
    }
  }),
  "Suggest extracting a required clause and keyword selector before an optional named clause",
);
