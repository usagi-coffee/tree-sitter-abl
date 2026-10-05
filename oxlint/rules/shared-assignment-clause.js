import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isStaticDsl,
  isStaticKeywordCall,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { sharedAssignmentClauses } from "../sharing-state.js";

export const sharedAssignmentClause = rule(
  (context) => ({
    CallExpression(node) {
      if (callName(node) !== "seq" || node.arguments.length !== 3 || !isStaticDsl(node)) return;
      const owner = enclosingRule(node);
      if (!owner || isRuleDisabled(context, owner) || isRuleDisabled(context, node)) return;
      for (let parent = node.parent; parent !== owner; parent = parent.parent) {
        if (
          [
            "alias",
            "token",
            "token.immediate",
            "prec",
            "prec.left",
            "prec.right",
            "prec.dynamic",
          ].includes(callName(parent))
        )
          return;
      }
      const [left, operator, right] = node.arguments;
      if (
        callName(left) !== "field" ||
        left.arguments.length !== 2 ||
        left.arguments[0].type !== "Literal" ||
        typeof left.arguments[0].value !== "string"
      )
        return;
      const target = memberName(left.arguments[1]),
        source = memberName(right);
      if (
        !target ||
        target.startsWith("__") ||
        operator.type !== "Literal" ||
        operator.value !== "="
      )
        return;
      if (
        !isStaticKeywordCall(right) &&
        !(source && !source.startsWith("__")) &&
        !(right.type === "Literal" && typeof right.value === "string")
      )
        return;
      if (node.arguments.some((part) => isRuleDisabled(context, part))) return;
      const candidate = {
        cwd: context.cwd,
        filename: context.filename,
        owner: ruleName(owner),
        map: context.sourceCode.getRange(owner.parent)[0],
        signature: JSON.stringify(
          context.sourceCode.getTokens(node).map(({ type, value }) => [type, value]),
        ),
      };
      const previous = sharedAssignmentClauses.find(
        (other) =>
          other.cwd === candidate.cwd &&
          other.signature === candidate.signature &&
          (other.filename !== candidate.filename ||
            (other.map === candidate.map && other.owner !== candidate.owner)),
      );
      if (previous)
        report(
          context,
          node,
          "shared-assignment-clause",
          `This ${left.arguments[0].value} assignment clause repeats ${previous.owner} (${previous.filename}); try sharing the complete field, equals sign and right-hand value in a hidden helper. Keep optionality at each caller, preserve fields and token identity, check visibility and precedence, then measure parser bytes and counts and validate trees.`,
        );
      else sharedAssignmentClauses.push(candidate);
    },
  }),
  "Suggest sharing complete field-led assignment clauses across grammar rules",
);
