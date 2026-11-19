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
import {
  projectPrecedenceSymbols,
  rootMetadataSymbols,
  usedOutsideFile,
} from "../helpers/project-metadata.js";

const directions = ["first", "last", "next", "prev", "current"];
const isCall = (node, name, count) => callName(node) === name && node.arguments.length === count;
const optionalValue = (node) => (isCall(node, "optional", 1) ? node.arguments[0] : null);
const privateName = (name) => name?.startsWith("__");

function isField(node, name, value) {
  return (
    isCall(node, "field", 2) &&
    node.arguments[0].type === "Literal" &&
    node.arguments[0].value === name &&
    memberName(node.arguments[1]) === value
  );
}

function isRecordSelector(node) {
  const selector = optionalValue(node);
  return (
    isCall(selector, "choice", directions.length) &&
    selector.arguments.every(
      (item, index) =>
        isCall(item, "alias", 2) &&
        memberName(item.arguments[0]) === `_kw_${directions[index]}` &&
        memberName(item.arguments[1]) === directions[index],
    )
  );
}

function isOptionsBody(body, name) {
  if (!isCall(body, "prec.right", 1) || !isCall(body.arguments[0], "seq", 2)) return false;
  const [alternatives, continuation] = body.arguments[0].arguments;
  return (
    isCall(alternatives, "choice", 3) &&
    alternatives.arguments.every(
      (item) =>
        memberName(item) ||
        (isCall(item, "alias", 2) &&
          privateName(memberName(item.arguments[0])) &&
          memberName(item.arguments[1]) &&
          !memberName(item.arguments[1]).startsWith("_")),
    ) &&
    memberName(optionalValue(continuation)) === name
  );
}

export const recordTargetExtraction = rule((context) => {
  const properties = [];
  const references = new Map();
  let dynamicReference = false;
  const suppressed = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" && node.arguments.some(suppressed));

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
    },
    "Program:exit"() {
      if (dynamicReference) return;
      let restricted;
      for (const owner of properties) {
        const name = ruleName(owner);
        const body = owner.value.body;
        if (!privateName(name) || !isCall(body, "seq", 5)) continue;
        const [keyword, selector, table, constant, options] = body.arguments;
        const optionsName = memberName(optionalValue(options));
        if (
          !memberName(keyword)?.startsWith("_kw_") ||
          !isRecordSelector(selector) ||
          !isField(table, "table", "_qualified_identifier") ||
          !isField(optionalValue(constant), "constant", "_expression") ||
          !privateName(optionsName) ||
          optionsName === name
        )
          continue;

        const uses = references.get(name);
        if (uses?.length !== 1) continue;
        const [use] = uses;
        const wrapper = enclosingRule(use);
        if (!wrapper || wrapper.parent !== owner.parent) continue;
        const wrapperName = ruleName(wrapper);
        const statement = wrapper.value.body;
        if (
          wrapperName.startsWith("_") ||
          !wrapperName.endsWith("_statement") ||
          !isCall(statement, "seq", 2) ||
          statement.arguments[0] !== use ||
          memberName(statement.arguments[1]) !== "_terminator"
        )
          continue;

        const map = owner.parent.properties;
        if (map.some((entry) => entry.type === "SpreadElement" || entry.computed)) continue;
        const named = (target) => map.filter((entry) => ruleName(entry) === target);
        const optionsRules = named(optionsName);
        const [optionsRule] = optionsRules;
        if (
          named(name).length !== 1 ||
          named(wrapperName).length !== 1 ||
          optionsRules.length !== 1 ||
          !isRuleProperty(optionsRule) ||
          !isOptionsBody(optionsRule.value.body, optionsName) ||
          [owner, body, wrapper, statement, optionsRule, optionsRule.value.body].some(suppressed)
        )
          continue;

        restricted ??= new Set([
          ...rootMetadataSymbols(context, [
            "inline",
            "conflicts",
            "supertypes",
            "externals",
            "extras",
            "word",
          ]),
          ...projectPrecedenceSymbols(context),
        ]);
        if (
          [name, wrapperName, optionsName].some(
            (symbol) =>
              restricted.has(symbol) ||
              references.get(symbol)?.some((reference) => !enclosingRule(reference)),
          ) ||
          usedOutsideFile(context, name, { wholeName: true })
        )
          continue;

        report(
          context,
          table,
          "record-target-extraction",
          "Try extracting the table field and optional constant expression into one private target rule. Leave the keyword, selector aliases, recursive options, enclosing precedence and terminator in place. Compare parser metrics, parsing speed and complete valid and recovery trees before retaining the change.",
        );
      }
    },
  };
}, "Suggest extracting a qualified record target with an optional constant expression");
