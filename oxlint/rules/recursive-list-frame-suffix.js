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
import {
  keywordInlineSymbols,
  projectPrecedenceSymbols,
  rootMetadataSymbols,
  usedOutsideFile,
} from "../helpers/project-metadata.js";

const ruleId = "recursive-list-frame-suffix";
const isCall = (node, name, arity) => callName(node) === name && node.arguments.length === arity;
const optionalSymbol = (node) =>
  isCall(node, "optional", 1) ? memberName(node.arguments[0]) : null;

function isUnaliasedUse(use, caller) {
  for (let node = use; node !== caller.value.body; node = node.parent) {
    if (!["seq", "choice", "optional"].includes(callName(node.parent))) return false;
  }
  return true;
}

function reachesRule(node, name, local, seen = new Set()) {
  return referencedSymbols(node).some((symbol) => {
    if (symbol === name) return true;
    if (seen.has(symbol)) return false;
    seen.add(symbol);
    const definition = local.get(symbol);
    return definition && reachesRule(definition.value.body, name, local, seen);
  });
}

export const recursiveListFrameSuffix = rule((context) => {
  const owners = [];
  const references = new Map();
  let dynamicReference = false;
  const suppressed = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" && node.arguments.some(suppressed));

  return {
    Property(node) {
      if (!isRuleProperty(node) || !ruleName(node).startsWith("__")) return;
      const body = node.value.body;
      if (
        callName(body) === "seq" &&
        body.arguments.length >= 2 &&
        optionalSymbol(body.arguments.at(-1)) === "frame_phrase"
      )
        owners.push(node);
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
      let restricted;
      for (const owner of owners) {
        const name = ruleName(owner);
        const body = owner.value.body;
        const [listUse, frame] = body.arguments.slice(-2);
        const listName = memberName(listUse);
        if (!listName?.startsWith("__") || references.get(listName)?.length !== 2) continue;

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
        if (local.size !== map.properties.length || local.has("frame_phrase")) continue;

        const ownerUses = references.get(name);
        if (ownerUses?.length !== 1) continue;
        const [ownerUse] = ownerUses;
        const caller = enclosingRule(ownerUse);
        if (
          caller?.parent !== map ||
          caller === owner ||
          !isUnaliasedUse(ownerUse, caller) ||
          reachesRule(body, ruleName(caller), local)
        )
          continue;

        const list = local.get(listName);
        const precedence = list?.value.body;
        if (!isCall(precedence, "prec.right", 1)) continue;
        const [sequence] = precedence.arguments;
        if (!isCall(sequence, "seq", 2)) continue;
        const [items, continuation] = sequence.arguments;
        if (
          optionalSymbol(continuation) !== listName ||
          callName(items) !== "choice" ||
          items.arguments.length < 2
        )
          continue;
        if (
          items.arguments.some((item) => {
            const symbol = memberName(item);
            return (
              !symbol || symbol.startsWith("__") || symbol === "frame_phrase" || local.has(symbol)
            );
          }) ||
          body.arguments
            .slice(0, -2)
            .some((prefix) => reachesRule(prefix, "frame_phrase", local)) ||
          [caller, owner, body, list, precedence].some(suppressed)
        )
          continue;

        restricted ??= new Set([
          ...rootMetadataSymbols(context, [
            "conflicts",
            "supertypes",
            "externals",
            "extras",
            "word",
          ]),
          ...keywordInlineSymbols(context),
          ...projectPrecedenceSymbols(context),
        ]);
        if (
          [name, listName].some(
            (symbol) =>
              restricted.has(symbol) || usedOutsideFile(context, symbol, { wholeName: true }),
          )
        )
          continue;

        report(
          context,
          frame,
          ruleId,
          `Try moving the optional FRAME phrase in ${name} into the terminal branch of ${listName}. Keep the item required and make the recursive continuation and FRAME mutually exclusive in one optional choice. Preserve item order, aliases and right precedence. Compare parser metrics, parsing speed, and complete valid and recovery trees before keeping the change.`,
        );
      }
    },
  };
}, "Suggest moving an optional FRAME phrase into the terminal branch of a required right-recursive list");
