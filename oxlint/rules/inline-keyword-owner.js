import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isStaticKeywordCall,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { inlineKeywordFamilies } from "../sharing-state.js";

export const inlineKeywordOwner = rule((context) => {
  const calls = [];
  const keyFor = (node) =>
    JSON.stringify([
      context.cwd,
      context.sourceCode.getTokens(node).map(({ type, value }) => [type, value]),
    ]);
  const familyFor = (key) => {
    if (!inlineKeywordFamilies.has(key)) inlineKeywordFamilies.set(key, {});
    return inlineKeywordFamilies.get(key);
  };
  return {
    CallExpression(node) {
      if (!isStaticKeywordCall(node)) return;
      const owner = enclosingRule(node);
      if (!owner) return;
      for (let parent = node.parent; parent !== owner; parent = parent.parent) {
        if (["token", "token.immediate"].includes(callName(parent))) return;
      }
      calls.push({ node, owner, key: keyFor(node) });
    },
    "Program:exit"() {
      for (const { node, owner, key } of calls) {
        const family = familyFor(key);
        if (owner.value.body === node && ruleName(owner).startsWith("_")) family.owned = true;
        if (isRuleDisabled(context, node) || isRuleDisabled(context, owner)) family.blocked = true;
      }
      for (const { node, owner, key } of calls) {
        const family = familyFor(key);
        if (family.owned || family.blocked || family.reported) continue;
        if (!family.first) {
          family.first = `${ruleName(owner)} in ${context.filename.split(/[\\/]/).at(-1)}`;
          continue;
        }
        report(
          context,
          node,
          "inline-keyword-owner",
          `This exact ${JSON.stringify(node.arguments[0].value)} keyword call repeats ${family.first}; try a shared helper marked inline from inception for this keyword family. Preserve the exact kw options and every surrounding alias, check all uses and existing helpers, then measure generated token-name bytes and compare complete CSTs.`,
        );
        family.reported = true;
      }
    },
  };
}, "Suggest dedicated inline owners for repeated exact keyword tokens");
