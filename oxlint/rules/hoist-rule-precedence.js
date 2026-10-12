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
import { projectPrecedenceSymbols, rootMetadataSymbols } from "../helpers/project-metadata.js";

export const hoistRulePrecedence = rule((context) => {
  const properties = [],
    references = new Map();
  const restricted = rootMetadataSymbols(context, [
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
  const unsafe = (node) =>
    isRuleDisabled(context, node) ||
    (node?.type === "CallExpression" &&
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
          wrapper = property.value.body,
          operator = callName(wrapper);
        if (
          !name.startsWith("_") ||
          restricted.has(name) ||
          isRuleDisabled(context, property) ||
          isRuleDisabled(context, wrapper) ||
          !["prec", "prec.left", "prec.right"].includes(operator) ||
          wrapper.arguments.length !== 1
        )
          continue;
        const body = wrapper.arguments[0];
        if (!isStaticDsl(body) || unsafe(body)) continue;
        const localRules = new Map(
          properties.filter((p) => p.parent === property.parent).map((p) => [ruleName(p), p]),
        );
        const recursive = (symbol, active = new Set()) => {
          if (!localRules.has(symbol)) return false;
          if (active.has(symbol)) return true;
          const next = new Set(active).add(symbol);
          return referencedSymbols(localRules.get(symbol).value.body).some((child) =>
            recursive(child, next),
          );
        };
        if (recursive(name)) continue;
        const uses = references.get(name) ?? [],
          parents = new Set();
        if (
          !uses.length ||
          !uses.every((use) => {
            const owner = enclosingRule(use);
            if (
              !owner ||
              owner === property ||
              owner.parent !== property.parent ||
              restricted.has(ruleName(owner)) ||
              isRuleDisabled(context, owner)
            )
              return false;
            for (let current = use; current !== owner; current = current.parent) {
              if (
                isRuleDisabled(context, current) ||
                (current.type === "CallExpression" &&
                  !["seq", "choice", "optional", "repeat", "repeat1"].includes(callName(current)))
              )
                return false;
            }
            parents.add(ruleName(owner));
            return true;
          })
        )
          continue;
        report(
          context,
          property,
          "hoist-rule-precedence",
          `${name} wraps its whole body in ${operator} without a named precedence; consider inlining that body into parent rule(s) ${[...parents].join(", ")} and applying ${operator}("named precedence", ...) to the relevant parent alternative. Declare the name and its relative order in grammar/precedences. Preserve associativity, fields and aliases; check external uses and metadata before removing the helper. Moving precedence changes reduction scope, so measure parser counts and compare complete valid and recovery trees before retaining it.`,
        );
      }
    },
  };
}, "Suggest moving unnamed whole-rule precedence to named parent alternatives");
