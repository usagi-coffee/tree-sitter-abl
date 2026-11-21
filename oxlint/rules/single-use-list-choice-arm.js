import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  isStaticDsl,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { usedOutsideFile } from "../helpers/project-metadata.js";

const optionalValue = (node) =>
  callName(node) === "optional" && node.arguments.length === 1 ? node.arguments[0] : null;

function namedAlias(node) {
  if (callName(node) !== "alias" || node.arguments.length !== 2) return false;
  const [source, target] = node.arguments.map(memberName);
  return Boolean(source && target && source !== target && !target.startsWith("_"));
}

function isRightRecursiveList(property) {
  const body = property.value.body;
  if (callName(body) !== "prec.right" || !isStaticDsl(body)) return false;
  if (body.arguments.length === 2 && body.arguments[0].type !== "Literal") return false;
  if (body.arguments.length < 1 || body.arguments.length > 2) return false;

  const sequence = body.arguments.at(-1);
  if (callName(sequence) !== "seq" || sequence.arguments.length !== 2) return false;

  const [item, tail] = sequence.arguments;
  return namedAlias(item) && memberName(optionalValue(tail)) === ruleName(property);
}

const suppressed = (context, node) =>
  isRuleDisabled(context, node) ||
  (node.type === "CallExpression" && node.arguments.some((part) => suppressed(context, part)));

export const singleUseListChoiceArm = rule((context) => {
  const references = new Map();
  const properties = [];
  let dynamicReference = false;

  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      if (node.object.type !== "Identifier" || node.object.name !== "$") return;
      const name = memberName(node) ?? (node.computed && node.property.value);
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

      for (const property of properties) {
        const name = ruleName(property);
        const body = property.value.body;
        if (
          !name.startsWith("_") ||
          callName(body) !== "seq" ||
          body.arguments.length < 3 ||
          isRuleDisabled(context, property)
        )
          continue;

        const [list, modifier, ...suffix] = body.arguments;
        const listName = memberName(list);
        if (
          !listName?.startsWith("_") ||
          !namedAlias(optionalValue(modifier)) ||
          !suffix.every((part) => memberName(optionalValue(part)))
        )
          continue;

        const uses = references.get(name) ?? [];
        if (uses.length !== 1) continue;
        const [use] = uses;
        const owner = enclosingRule(use);
        const choice = use.parent;
        if (
          memberName(use) !== name ||
          !owner ||
          owner.parent !== property.parent ||
          owner.value.body !== choice ||
          callName(choice) !== "choice" ||
          choice.arguments.length !== 2 ||
          !choice.arguments.every((alternative) => memberName(alternative)) ||
          choice.arguments.some((alternative) => memberName(alternative) === ruleName(owner)) ||
          isRuleDisabled(context, owner) ||
          suppressed(context, choice) ||
          suppressed(context, body)
        )
          continue;

        const entries = property.parent.properties;
        if (
          entries.some(
            (entry) => entry.type !== "Property" || entry.computed || ruleName(entry) === null,
          )
        )
          continue;
        const local = new Map(entries.map((entry) => [ruleName(entry), entry]));
        if (local.size !== entries.length) continue;
        const listRule = local.get(listName);
        if (
          !listRule ||
          ![property, owner, listRule].every(
            (entry) =>
              isRuleProperty(entry) && !entry.value.async && entry.value.params.length === 1,
          ) ||
          !isRightRecursiveList(listRule) ||
          (references.get(ruleName(owner)) ?? []).some((reference) => !enclosingRule(reference)) ||
          usedOutsideFile(context, name, { wholeName: true }) ||
          usedOutsideFile(context, ruleName(owner), { wholeName: true })
        )
          continue;

        report(
          context,
          property,
          "single-use-list-choice-arm",
          `${name} has one direct choice-arm use in ${ruleName(owner)}. Try inlining the sequence in that arm, keeping the required list, optional alias and suffixes, and branch order intact. Compare parser metrics, parsing speed, and complete valid and recovery trees before retaining the change.`,
        );
      }
    },
  };
}, "Suggest inlining a single-use hidden list sequence into its choice arm");
