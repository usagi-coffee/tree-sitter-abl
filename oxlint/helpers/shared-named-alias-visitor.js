import {
  sharedExpressionAliases,
  sharedItemAliases,
  sharedStatementAliases,
} from "../sharing-state.js";
import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  memberName,
  report,
  ruleName,
  unwrap,
} from "../helpers.js";

export function sharedNamedAliasVisitor(context, kind = "statement") {
  const properties = [];
  const candidates = [];
  const expression = kind === "expression";
  const item = kind === "item";
  const aliases = item
    ? sharedItemAliases
    : expression
      ? sharedExpressionAliases
      : sharedStatementAliases;
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    CallExpression(node) {
      if (callName(node) !== "alias" || node.arguments.length !== 2) return;
      const source = memberName(node.arguments[0]);
      const target = memberName(node.arguments[1]);
      if (item) {
        if (!source?.startsWith("_") || source.startsWith("__") || !target?.endsWith("_item"))
          return;
        if (
          source.endsWith("_keyword") ||
          source.endsWith("_token") ||
          source.endsWith("_phrase") ||
          source.endsWith("_expression")
        )
          return;
      } else if (expression) {
        if (!source?.endsWith("_expression") || source.startsWith("__")) return;
      } else if (!source?.endsWith("_statement") || source.startsWith("_")) return;
      if (!target || target.startsWith("_") || source === target) return;
      const owner = enclosingRule(node);
      if (!owner) return;
      for (let parent = node.parent; parent !== owner; parent = parent.parent) {
        if (["alias", "token", "token.immediate"].includes(callName(parent))) return;
      }
      const reportNode = owner.value.body === node ? owner : node;
      if (isRuleDisabled(context, reportNode)) return;
      candidates.push({ node, reportNode, owner, source, target });
    },
    "Program:exit"() {
      for (const { node, reportNode, owner, source, target } of candidates) {
        const definition = properties.find((property) => ruleName(property) === source);
        if (
          definition &&
          !["seq", "choice", "repeat1"].includes(callName(unwrap(definition.value.body)))
        )
          continue;
        const key = JSON.stringify([context.cwd, source, target]);
        const candidate = {
          filename: context.filename,
          rule: ruleName(owner),
          start: context.sourceCode.getRange(node)[0],
          line: node.loc.start.line,
        };
        const previous = aliases.get(key);
        if (!previous) {
          aliases.set(key, candidate);
          continue;
        }
        if (previous.filename === candidate.filename && previous.start === candidate.start)
          continue;
        const location = `${previous.filename.split(/[\\/]/).at(-1)}:${previous.line}`;
        report(
          context,
          reportNode,
          `shared-${kind}-alias`,
          `This alias of ${source} as ${target} duplicates ${previous.rule} in ${location}; try sharing one hidden helper containing the exact alias. ${item ? "Confirm the source is a nonterminal item rule and check grammar metadata. " : expression ? "Confirm the source is a nonterminal expression and check grammar metadata. " : ""}Preserve named nodes, fields and precedence; measure parser size and validate trees.`,
        );
      }
    },
  };
}
