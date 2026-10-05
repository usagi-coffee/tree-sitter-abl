import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  memberName,
  report,
  rule,
  ruleName,
  unwrap,
} from "../helpers.js";

export const phraseAliasExtraction = rule((context) => {
  const properties = [];
  const candidates = [];
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    CallExpression(node) {
      if (callName(node) !== "alias" || node.arguments.length !== 2) return;
      const source = memberName(node.arguments[0]);
      const target = memberName(node.arguments[1]);
      if (!source?.startsWith("_") || !source.endsWith("_phrase")) return;
      if (!target?.endsWith("_phrase") || target.startsWith("_")) return;
      const owner = enclosingRule(node);
      if (!owner) return;
      for (let parent = node.parent; parent !== owner; parent = parent.parent) {
        if (["alias", "token", "token.immediate"].includes(callName(parent))) return;
      }
      const reportNode = owner.value.body === node ? owner : node;
      if (isRuleDisabled(context, reportNode)) return;
      candidates.push({ node: reportNode, owner, source, target });
    },
    "Program:exit"() {
      const groups = new Map();
      for (const candidate of candidates) {
        const { owner, source, target } = candidate;
        const definition = properties.find(
          (property) => property.parent === owner.parent && ruleName(property) === source,
        );
        if (definition) {
          const body = unwrap(definition.value.body);
          if (!["seq", "choice"].includes(callName(body))) continue;
        }
        if (!groups.has(owner.parent)) groups.set(owner.parent, new Map());
        const aliases = groups.get(owner.parent);
        const key = `${source}:${target}`;
        const previous = aliases.get(key);
        if (!previous) {
          aliases.set(key, { reported: false });
          continue;
        }
        if (previous.reported) continue;
        previous.reported = true;
        report(
          context,
          candidate.node,
          "phrase-alias-extraction",
          `The alias of ${source} as ${target} is repeated in this rule map; try extracting or reusing a local hidden helper containing the exact alias. Confirm the source is a nonterminal phrase, preserve fields and precedence at each callsite, then measure parser size and validate trees.`,
        );
      }
    },
  };
}, "Suggest local helpers for repeated aliases of hidden nonterminal phrases");
