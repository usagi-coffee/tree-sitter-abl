import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { forwardedAliasDefinitions } from "../sharing-state.js";

export const forwardedAliasReuse = rule((context) => {
  const properties = [],
    aliases = [];
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    CallExpression(node) {
      if (callName(node) === "alias") aliases.push(node);
    },
    "Program:exit"() {
      for (let i = forwardedAliasDefinitions.length - 1; i >= 0; i--) {
        const old = forwardedAliasDefinitions[i];
        if (old.cwd === context.cwd && old.filename === context.filename)
          forwardedAliasDefinitions.splice(i, 1);
      }
      for (const property of properties) {
        const name = ruleName(property),
          target = memberName(property.value.body);
        if (name.startsWith("_")) continue;
        forwardedAliasDefinitions.push({
          cwd: context.cwd,
          filename: context.filename,
          map: context.sourceCode.getRange(property.parent)[0],
          name,
          target: target?.startsWith("_") && !isRuleDisabled(context, property) ? target : null,
        });
      }
      const lookup = (name) => {
        const matches = forwardedAliasDefinitions.filter(
          (entry) => entry.cwd === context.cwd && entry.name === name,
        );
        return matches.length === 1 && matches[0].target ? matches[0] : null;
      };
      for (const node of aliases) {
        if (node.arguments.length !== 2) continue;
        const from = memberName(node.arguments[0]),
          to = memberName(node.arguments[1]),
          owner = enclosingRule(node);
        if (
          !from ||
          !to ||
          from === to ||
          from.startsWith("_") ||
          to.startsWith("_") ||
          !owner ||
          isRuleDisabled(context, node) ||
          isRuleDisabled(context, owner)
        )
          continue;
        const source = lookup(from),
          target = lookup(to);
        if (
          !source ||
          !target ||
          source.target !== target.target ||
          source.filename !== target.filename ||
          source.map !== target.map
        )
          continue;
        if (
          source.filename === context.filename &&
          source.map !== context.sourceCode.getRange(owner.parent)[0]
        )
          continue;
        let unsafe = false;
        for (let parent = node.parent; parent !== owner; parent = parent.parent) {
          if (
            parent.type === "CallExpression" &&
            ![
              "seq",
              "choice",
              "optional",
              "repeat",
              "repeat1",
              "field",
              "prec",
              "prec.left",
              "prec.right",
            ].includes(callName(parent))
          )
            unsafe = true;
        }
        if (unsafe) continue;
        report(
          context,
          node,
          "forwarded-alias-reuse",
          `${from} and ${to} both forward to ${source.target}; try using $.${to} directly at this alias. Retain other role-specific uses, check their precedence and conflicts, then measure parser size and verify syntax and tree shape.`,
        );
      }
    },
  };
}, "Suggest reusing existing public alias targets with identical hidden forwarding bodies");
