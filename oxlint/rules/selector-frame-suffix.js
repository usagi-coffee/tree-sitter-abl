import {
  callName,
  isNullable,
  isRuleDisabled,
  isRuleProperty,
  isStaticDsl,
  isStaticKeywordCall,
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

const ruleId = "selector-frame-suffix";
const isCall = (node, name, arity) => callName(node) === name && node.arguments.length === arity;
const optionalSymbol = (node) =>
  isCall(node, "optional", 1) ? memberName(node.arguments[0]) : null;

function isAllArm(node) {
  if (!isCall(node, "seq", 2)) return false;
  const [flag, exceptions] = node.arguments;
  if (!isCall(flag, "alias", 2) || optionalSymbol(exceptions) !== "_except_fields") return false;
  const [keyword, alias] = flag.arguments;
  return (
    isStaticKeywordCall(keyword) &&
    keyword.arguments[0].value.toUpperCase() === "ALL" &&
    memberName(alias) === "all"
  );
}

export const selectorFrameSuffix = rule((context) => {
  const owners = [];
  const references = new Map();
  let dynamicReference = false;
  const suppressed = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" && node.arguments.some(suppressed));

  return {
    Property(node) {
      if (isRuleProperty(node) && /^__.+_body$/.test(ruleName(node))) owners.push(node);
    },
    MemberExpression(node) {
      if (node.object.type !== "Identifier" || node.object.name !== "$") return;
      const name = memberName(node);
      if (!name) {
        dynamicReference = true;
        return;
      }
      if (!name.startsWith("__")) return;
      const uses = references.get(name) ?? [];
      uses.push(node);
      references.set(name, uses);
    },
    "Program:exit"() {
      if (dynamicReference) return;
      for (const owner of owners) {
        const body = owner.value.body;
        if (callName(body) !== "seq" || body.arguments.length < 2) continue;
        const [selectorUse, suffix] = body.arguments.slice(-2);
        if (optionalSymbol(suffix) !== "frame_phrase") continue;

        const name = ruleName(owner);
        const stem = name.slice(2, -"_body".length);
        const privateName = `__${stem}_`;
        const map = owner.parent;
        const factory = map.parent;
        if (
          factory?.type !== "ArrowFunctionExpression" ||
          factory.parent?.type !== "ExportDefaultDeclaration" ||
          map.properties.some(
            (entry) =>
              !isRuleProperty(entry) ||
              entry.computed ||
              entry.value.async ||
              entry.value.params.length !== 1 ||
              !isStaticDsl(entry.value.body),
          )
        )
          continue;
        const local = new Map(map.properties.map((entry) => [ruleName(entry), entry]));
        if (local.size !== map.properties.length) continue;

        const statement = local.get(`${stem}_statement`);
        const statementBody = statement?.value.body;
        if (!isCall(statementBody, "seq", 3)) continue;
        const [keyword, bodyUse, terminator] = statementBody.arguments;
        if (
          (!isStaticKeywordCall(keyword) && !memberName(keyword)?.startsWith("_kw_")) ||
          optionalSymbol(bodyUse) !== name ||
          !["_terminator", "_no_error_terminator"].includes(memberName(terminator)) ||
          references.get(name)?.length !== 1
        )
          continue;

        const selectorName = memberName(selectorUse);
        if (!selectorName?.startsWith(privateName) || references.get(selectorName)?.length !== 1)
          continue;
        const selector = local.get(selectorName);
        const choice = selector?.value.body;
        if (!isCall(choice, "choice", 2) || !isAllArm(choice.arguments[0])) continue;

        const listName = memberName(choice.arguments[1]);
        if (!listName?.startsWith(privateName) || references.get(listName)?.length !== 2) continue;
        const list = local.get(listName);
        const precedence = list?.value.body;
        if (!isCall(precedence, "prec.right", 1)) continue;
        const [sequence] = precedence.arguments;
        if (!isCall(sequence, "seq", 2)) continue;
        const [aliasedItem, continuation] = sequence.arguments;
        if (!isCall(aliasedItem, "alias", 2) || optionalSymbol(continuation) !== listName) continue;
        const itemName = memberName(aliasedItem.arguments[0]);
        const itemAlias = memberName(aliasedItem.arguments[1]);
        const item = local.get(itemName);
        if (
          !itemName?.startsWith(privateName) ||
          !itemAlias ||
          itemAlias.startsWith("_") ||
          !item ||
          isNullable(item.value.body)
        )
          continue;
        if (
          [owner, body, statement, statementBody, selector, choice, list, precedence, item].some(
            suppressed,
          )
        )
          continue;

        const restricted = rootMetadataSymbols(context, [
          "inline",
          "conflicts",
          "supertypes",
          "externals",
          "extras",
          "word",
        ]);
        for (const symbol of projectPrecedenceSymbols(context)) restricted.add(symbol);
        if (
          [name, selectorName, listName].some(
            (symbol) =>
              restricted.has(symbol) || usedOutsideFile(context, symbol, { wholeName: true }),
          )
        )
          continue;

        report(
          context,
          suffix,
          ruleId,
          `Try moving the optional FRAME phrase in ${name} onto the ALL arm and the terminal item-list branch. Keep the list continuation and FRAME as mutually exclusive alternatives so FRAME remains optional and appears at most once. Retain the right precedence and aliases, and compare parser metrics, parsing speed, and valid and recovery trees.`,
        );
      }
    },
  };
}, "Suggest moving an optional FRAME phrase into the alternatives of a required selector");
