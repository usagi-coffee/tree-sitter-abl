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
import { usedOutsideFile } from "../helpers/project-metadata.js";

const projectionName = "__record_field_list";
const fieldsName = "__record_fields_list";
const exceptName = "__record_except_list";
const prefixName = "__record_field_names_prefix";
const tailName = "__record_field_list_preprocessor_tail";
const checkedNames = [projectionName, fieldsName, exceptName, prefixName, tailName];

const isCall = (node, name, count) => callName(node) === name && node.arguments.length === count;
const optionalValue = (node) => (isCall(node, "optional", 1) ? node.arguments[0] : null);
const isLiteral = (node, value) => node?.type === "Literal" && node.value === value;

function isFieldsKeyword(node) {
  if (!isCall(node, "kw", 2)) return false;
  const [keyword, options] = node.arguments;
  if (
    !isLiteral(keyword, "FIELDS") ||
    options.type !== "ObjectExpression" ||
    options.properties.length !== 2
  )
    return false;
  const [alias, offset] = options.properties;
  return (
    options.properties.every((entry) => entry.type === "Property" && !entry.computed) &&
    ruleName(alias) === "alias" &&
    isLiteral(alias.value, "FIELD") &&
    ruleName(offset) === "offset" &&
    isLiteral(offset.value, 5)
  );
}

export const recordProjectionFactoring = rule((context) => {
  const candidates = [];
  const references = new Map();
  let computedReference = false;
  const suppressed = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" && node.arguments.some(suppressed));
  const onlyUses = (name, ...nodes) => {
    const uses = references.get(name);
    return uses?.length === nodes.length && nodes.every((node) => uses.includes(node));
  };

  return {
    Property(node) {
      if (isRuleProperty(node) && ruleName(node) === projectionName) candidates.push(node);
    },
    MemberExpression(node) {
      if (node.object.type !== "Identifier" || node.object.name !== "$") return;
      const name = memberName(node);
      if (!name) {
        computedReference = true;
        return;
      }
      if (!checkedNames.includes(name)) return;
      const uses = references.get(name) ?? [];
      uses.push(node);
      references.set(name, uses);
    },
    "Program:exit"() {
      if (computedReference || references.has(fieldsName)) return;

      for (const owner of candidates) {
        const body = owner.value.body;
        if (!isCall(body, "choice", 2)) continue;
        const [fieldsThenOptionalExcept, exceptOnly] = body.arguments;
        if (!isCall(fieldsThenOptionalExcept, "seq", 2) || memberName(exceptOnly) !== exceptName)
          continue;

        const [fields, exceptOption] = fieldsThenOptionalExcept.arguments;
        if (!isCall(fields, "seq", 2) || !isFieldsKeyword(fields.arguments[0])) continue;
        const fieldsSuffix = optionalValue(fields.arguments[1]);
        const optionalExcept = optionalValue(exceptOption);
        if (
          !isCall(fieldsSuffix, "seq", 2) ||
          memberName(fieldsSuffix.arguments[0]) !== prefixName ||
          !isLiteral(fieldsSuffix.arguments[1], ")") ||
          memberName(optionalExcept) !== exceptName ||
          !onlyUses(exceptName, exceptOnly, optionalExcept)
        )
          continue;

        const map = owner.parent.properties;
        if (map.some((entry) => entry.type !== "Property" || entry.computed)) continue;
        const named = (name) => map.filter((entry) => ruleName(entry) === name);
        if (named(projectionName).length !== 1 || named(fieldsName).length !== 0) continue;
        const relatedRules = [exceptName, prefixName, tailName].map(named);
        if (
          relatedRules.some(([entry, ...rest]) => !entry || rest.length || !isRuleProperty(entry))
        )
          continue;

        const [[exceptRule], [prefixRule], [tailRule]] = relatedRules;
        const except = exceptRule.value.body;
        const prefix = prefixRule.value.body;
        const tail = tailRule.value.body;
        if (
          !isCall(except, "seq", 3) ||
          memberName(except.arguments[0]) !== "_kw_except" ||
          memberName(except.arguments[1]) !== prefixName ||
          !isLiteral(except.arguments[2], ")") ||
          !onlyUses(prefixName, fieldsSuffix.arguments[0], except.arguments[1]) ||
          !isCall(prefix, "seq", 2) ||
          !isLiteral(prefix.arguments[0], "(") ||
          memberName(optionalValue(prefix.arguments[1])) !== "__record_field_names" ||
          !isCall(tail, "choice", 2) ||
          !isCall(tail.arguments[0], "seq", 2) ||
          memberName(tail.arguments[1]) !== "preprocessor_name"
        )
          continue;

        const [projectionAlias, preprocessor] = tail.arguments[0].arguments;
        if (
          !isCall(projectionAlias, "alias", 2) ||
          memberName(projectionAlias.arguments[0]) !== projectionName ||
          memberName(projectionAlias.arguments[1]) !== "field_list" ||
          !onlyUses(projectionName, projectionAlias.arguments[0]) ||
          memberName(optionalValue(preprocessor)) !== "preprocessor_name" ||
          references.get(tailName)?.some((use) => !enclosingRule(use)) ||
          [owner, body, exceptRule, except, prefixRule, prefix, tailRule, tail].some(suppressed) ||
          checkedNames.some((name) => usedOutsideFile(context, name, { wholeName: true }))
        )
          continue;

        report(
          context,
          owner,
          "record-projection-factoring",
          "Try extracting the existing FIELDS clause into __record_fields_list. Use it as the first alternative and optionally before required EXCEPT in the second. Preserve the FIELD abbreviation, optional parentheses, and enclosing field_list alias. Compare parser metrics, parsing speed, and complete valid and recovery trees before retaining the change.",
        );
      }
    },
  };
}, "Suggest factoring the FIELDS clause in the record projection choice");
