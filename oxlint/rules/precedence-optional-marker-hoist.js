import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  isStaticDsl,
  isStaticKeywordCall,
  memberName,
  referencedSymbols,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { rootMetadataSymbols } from "../helpers/project-metadata.js";

export const precedenceOptionalMarkerHoist = rule((context) => {
  const properties = [],
    references = new Map(),
    restricted = rootMetadataSymbols(context, [
      "inline",
      "conflicts",
      "precedences",
      "supertypes",
      "externals",
    ]);
  let dynamicReference = false;
  const keyword = (node) =>
    isStaticKeywordCall(node) ||
    /^_kw_/.test(memberName(node) ?? "") ||
    (node?.type === "Literal" &&
      typeof node.value === "string" &&
      /^[A-Z][A-Z-]*$/.test(node.value));
  const valuedClause = (node) => {
    if (callName(node) !== "seq" || node.arguments.length !== 2) return false;
    const [marker, value] = node.arguments;
    return (
      keyword(marker) &&
      callName(value) === "field" &&
      value.arguments.length === 2 &&
      value.arguments[0].type === "Literal" &&
      typeof value.arguments[0].value === "string" &&
      !!memberName(value.arguments[1])
    );
  };
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      const name =
        memberName(node) ??
        (node.computed &&
        node.object.type === "Identifier" &&
        node.object.name === "$" &&
        node.property.type === "Literal" &&
        typeof node.property.value === "string"
          ? node.property.value
          : null);
      if (!name) {
        if (node.computed && node.object.type === "Identifier" && node.object.name === "$")
          dynamicReference = true;
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
        if (!name.startsWith("__") || restricted.has(name) || isRuleDisabled(context, property))
          continue;
        if (!["prec", "prec.left", "prec.right"].includes(callName(body))) continue;
        if (!isStaticDsl(body) || referencedSymbols(body).includes(name)) continue;
        let sequence = body;
        while (["prec", "prec.left", "prec.right"].includes(callName(sequence))) {
          if (
            sequence.arguments.length < 1 ||
            sequence.arguments.length > 2 ||
            (callName(sequence) === "prec" && sequence.arguments.length !== 2) ||
            !sequence.arguments.slice(0, -1).every((part) => part.type === "Literal")
          )
            break;
          sequence = sequence.arguments.at(-1);
        }
        if (callName(sequence) !== "seq" || sequence.arguments.length !== 2) continue;
        const [head, tail] = sequence.arguments;
        if (
          callName(head) !== "choice" ||
          head.arguments.length < 2 ||
          !head.arguments.every(valuedClause) ||
          callName(tail) !== "optional" ||
          tail.arguments.length !== 1 ||
          !keyword(tail.arguments[0])
        )
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length !== 1 || memberName(uses[0]) !== name) continue;
        const use = uses[0],
          owner = enclosingRule(use);
        if (
          !owner ||
          owner === property ||
          owner.parent !== property.parent ||
          callName(use.parent) !== "choice" ||
          isRuleDisabled(context, owner) ||
          isRuleDisabled(context, use)
        )
          continue;
        let unsafe = false;
        for (let parent = use.parent; parent !== owner; parent = parent.parent) {
          if (
            isRuleDisabled(context, parent) ||
            (parent.type === "CallExpression" &&
              ![
                "seq",
                "choice",
                "optional",
                "repeat",
                "repeat1",
                "prec",
                "prec.left",
                "prec.right",
              ].includes(callName(parent)))
          )
            unsafe = true;
        }
        if (unsafe) continue;
        report(
          context,
          property,
          "precedence-optional-marker-hoist",
          `${name} has a precedence-wrapped valued choice and an optional trailing keyword at one choice use; try moving the optional keyword to that caller. Keep the complete original precedence and associativity on both the helper head and the caller sequence, preserve fields and keyword identity, check external references and metadata, then measure large states and actions and compare complete recovery trees.`,
        );
      }
    },
  };
}, "Suggest hoisting optional keyword tails from precedence-wrapped valued choices");
