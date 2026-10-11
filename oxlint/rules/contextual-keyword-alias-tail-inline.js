import {
  callName,
  dslSignature,
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
import { projectPrecedenceSymbols, rootMetadataSymbols } from "../helpers/project-metadata.js";

export const contextualKeywordAliasTailInline = rule((context) => {
  const properties = [],
    references = new Map(),
    ordered = projectPrecedenceSymbols(context),
    restricted = rootMetadataSymbols(context, [
      "inline",
      "conflicts",
      "supertypes",
      "externals",
      "word",
    ]);
  let dynamicReference = false;
  const safeContext = (node, owner) => {
    for (let current = node; current !== owner; current = current.parent) {
      if (isRuleDisabled(context, current)) return false;
      if (
        current.type === "CallExpression" &&
        (![
          "seq",
          "choice",
          "optional",
          "repeat",
          "repeat1",
          "prec",
          "prec.left",
          "prec.right",
        ].includes(callName(current)) ||
          !isStaticDsl(current))
      )
        return false;
    }
    return !isRuleDisabled(context, owner);
  };
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
      if (!enclosingRule(node)) {
        for (let parent = node.parent; parent; parent = parent.parent) {
          if (parent.type !== "Property") continue;
          if (ruleName(parent) === "precedences") ordered.add(name);
          else restricted.add(name);
          break;
        }
        return;
      }
      if (!references.has(name)) references.set(name, []);
      references.get(name).push(node);
    },
    "Program:exit"() {
      if (dynamicReference) return;
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (
          !name.startsWith("_") ||
          name.startsWith("__") ||
          !ordered.has(name) ||
          restricted.has(name) ||
          isRuleDisabled(context, property) ||
          isRuleDisabled(context, body) ||
          callName(body) !== "choice" ||
          body.arguments.length < 2 ||
          body.arguments.length > 6 ||
          !isStaticDsl(body)
        )
          continue;
        const aliases = body.arguments;
        if (
          !aliases.every(
            (branch) =>
              callName(branch) === "alias" &&
              branch.arguments.length === 2 &&
              (memberName(branch.arguments[0])?.startsWith("_kw_") ||
                isStaticKeywordCall(branch.arguments[0])) &&
              memberName(branch.arguments[1]) &&
              !memberName(branch.arguments[1]).startsWith("_") &&
              !isRuleDisabled(context, branch),
          ) ||
          new Set(aliases.map((branch) => memberName(branch.arguments[1]))).size !== 1 ||
          new Set(aliases.map((branch) => dslSignature(branch.arguments[0]))).size !==
            aliases.length
        )
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length < 2) continue;
        for (const use of uses) {
          const owner = enclosingRule(use),
            choice = use.parent,
            field = choice?.parent,
            sequence = field?.parent;
          if (
            !owner ||
            owner === property ||
            owner.parent !== property.parent ||
            restricted.has(ruleName(owner)) ||
            ordered.has(ruleName(owner)) ||
            callName(choice) !== "choice" ||
            choice.arguments.length !== 2 ||
            !choice.arguments.every((branch) => memberName(branch)) ||
            memberName(choice.arguments[0]) === memberName(choice.arguments[1]) ||
            callName(field) !== "field" ||
            field.arguments.length !== 2 ||
            field.arguments[1] !== choice ||
            field.arguments[0].type !== "Literal" ||
            typeof field.arguments[0].value !== "string" ||
            callName(sequence) !== "seq" ||
            sequence.arguments.length < 2 ||
            sequence.arguments.at(-2) !== field
          )
            continue;
          const tail = sequence.arguments.at(-1);
          if (
            callName(tail) !== "optional" ||
            tail.arguments.length !== 1 ||
            !memberName(tail.arguments[0]) ||
            memberName(tail.arguments[0]) === name ||
            [use, choice, field, tail].some((node) => isRuleDisabled(context, node)) ||
            !safeContext(sequence, owner)
          )
            continue;
          report(
            context,
            use,
            "contextual-keyword-alias-tail-inline",
            `${name} joins another value in the ${field.arguments[0].value} field before an optional suffix; try splitting this caller's value branches and expanding the exact keyword aliases only in this branch, retaining the helper at other callers. Transfer every helper precedence ordering to named precedence around the expanded value and its complete optional suffix, preserving fields, alias identity, keyword options and alternative order. Prioritize LARGE_STATE_COUNT then ACTION_COUNT and compare complete valid and recovery trees before keeping the change.`,
          );
        }
      }
    },
  };
}, "Suggest caller-specific expansion of ordered keyword aliases with their optional suffix");
