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
import { usedOutsideFile } from "../helpers/project-metadata.js";

const fieldAncestors = new Set([
  "seq",
  "choice",
  "optional",
  "repeat",
  "repeat1",
  "prec",
  "prec.left",
  "prec.right",
]);

function commonAlias(choice) {
  if (callName(choice) !== "choice" || choice.arguments.length < 2) return null;
  let target;
  for (const alternative of choice.arguments) {
    if (callName(alternative) !== "alias" || alternative.arguments.length !== 2) return null;
    const [keyword, alias] = alternative.arguments;
    const name = memberName(alias);
    if (
      !isStaticKeywordCall(keyword) ||
      !name ||
      name.startsWith("_") ||
      (target && name !== target)
    )
      return null;
    target = name;
  }
  return target;
}

function directField(context, property, use) {
  const owner = enclosingRule(use);
  if (!owner || owner === property || owner.parent !== property.parent) return null;
  const field = use.parent;
  if (callName(field) !== "field" || field.arguments.length !== 2) return null;
  const [label, value] = field.arguments;
  if (value !== use || label.type !== "Literal" || typeof label.value !== "string" || !label.value)
    return null;
  if (!isStaticDsl(owner.value.body)) return null;
  if ([owner, field, use].some((node) => isRuleDisabled(context, node))) return null;
  for (let parent = field.parent; parent !== owner.value; parent = parent.parent) {
    if (!fieldAncestors.has(callName(parent)) || isRuleDisabled(context, parent)) return null;
  }
  const helperName = ruleName(property);
  const ownerName = ruleName(owner);
  if (
    property.parent.properties.some(
      (entry) =>
        entry.type === "SpreadElement" ||
        entry.computed ||
        (entry !== property && ruleName(entry) === helperName) ||
        (entry !== owner && ruleName(entry) === ownerName),
    )
  )
    return null;
  return field;
}

export const singleUseFieldKeywordAliasChoice = rule((context) => {
  const choices = [];
  const references = new Map();
  let dynamicReference = false;
  return {
    Property(node) {
      if (!isRuleProperty(node)) return;
      const name = ruleName(node);
      if (!name.startsWith("__") || name.endsWith("_body")) return;
      const target = commonAlias(node.value.body);
      if (target) choices.push({ node, name, target });
    },
    MemberExpression(node) {
      if (node.object.type !== "Identifier" || node.object.name !== "$") return;
      const name = memberName(node) ?? (node.computed ? node.property.value : null);
      if (typeof name !== "string") {
        dynamicReference = true;
        return;
      }
      const uses = references.get(name) ?? [];
      uses.push(node);
      references.set(name, uses);
    },
    "Program:exit"() {
      if (dynamicReference) return;
      for (const { node, name, target } of choices) {
        const uses = references.get(name);
        if (uses?.length !== 1 || memberName(uses[0]) !== name) continue;
        const field = directField(context, node, uses[0]);
        if (!field) continue;
        const body = node.value.body;
        if ([node, body, ...body.arguments].some((part) => isRuleDisabled(context, part))) continue;
        if (usedOutsideFile(context, name, { wholeName: true })) continue;
        report(
          context,
          node,
          "single-use-field-keyword-alias-choice",
          `${name} has one local use inside the ${field.arguments[0].value} field. Try inlining its keyword choice there, preserving the ${target} aliases, keyword options, alternative order, field scope, and caller precedence. Compare parser metrics, parsing speed, and complete valid and recovery trees.`,
        );
      }
    },
  };
}, "Suggest inlining a private choice of keyword aliases inside its only field use");
