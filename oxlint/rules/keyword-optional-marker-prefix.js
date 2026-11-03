import {
  callName,
  dslSignature,
  enclosingRule,
  isNullable,
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
import { projectPrecedenceSymbols, rootMetadataSymbols } from "../helpers/project-metadata.js";

export const keywordOptionalMarkerPrefix = rule((context) => {
  const properties = [],
    references = new Map(),
    restricted = rootMetadataSymbols(context, [
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
  const keyword = (node) => isStaticKeywordCall(node) || memberName(node)?.startsWith("_kw_");
  const unsafe = (node) =>
    isRuleDisabled(context, node) ||
    ["token", "token.immediate", "prec.dynamic"].includes(callName(node)) ||
    (node.type === "CallExpression" && node.arguments.some(unsafe));
  const optionalKeyword = (node) =>
    callName(node) === "optional" && node.arguments.length === 1 && keyword(node.arguments[0]);
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
          body = property.value.body;
        if (
          !name.startsWith("__") ||
          restricted.has(name) ||
          isRuleDisabled(context, property) ||
          callName(body) !== "seq" ||
          body.arguments.length < 4 ||
          !isStaticDsl(body) ||
          unsafe(body) ||
          referencedSymbols(body).includes(name)
        )
          continue;
        const [head, marker, operand, ...tail] = body.arguments;
        if (
          !keyword(head) ||
          !optionalKeyword(marker) ||
          dslSignature(head) === dslSignature(marker.arguments[0]) ||
          !memberName(operand)?.startsWith("__") ||
          tail.every((part) => isNullable(part))
        )
          continue;
        const selector = properties.find(
            (other) => other.parent === property.parent && ruleName(other) === memberName(operand),
          ),
          alternatives = selector?.value.body;
        if (
          !selector ||
          isRuleDisabled(context, selector) ||
          callName(alternatives) !== "choice" ||
          alternatives.arguments.length < 2 ||
          !isStaticDsl(alternatives) ||
          unsafe(alternatives) ||
          !alternatives.arguments.every((branch) => {
            if (callName(branch) !== "seq" || branch.arguments.length !== 2) return false;
            const [selectorMarker, value] = branch.arguments;
            return (
              (keyword(selectorMarker) || optionalKeyword(selectorMarker)) &&
              callName(value) === "field" &&
              value.arguments.length === 2 &&
              value.arguments[0].type === "Literal" &&
              typeof value.arguments[0].value === "string" &&
              memberName(value.arguments[1]) &&
              !keyword(value.arguments[1]) &&
              ![name, memberName(operand)].includes(memberName(value.arguments[1]))
            );
          }) ||
          !alternatives.arguments.some((branch) => optionalKeyword(branch.arguments[0]))
        )
          continue;
        const uses = references.get(name) ?? [];
        if (
          uses.length === 0 ||
          !uses.every((use) => {
            const owner = enclosingRule(use);
            if (!owner || owner.parent !== property.parent || isRuleDisabled(context, owner))
              return false;
            for (let current = use; current !== owner; current = current.parent) {
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
            return true;
          })
        )
          continue;
        report(
          context,
          property,
          "keyword-optional-marker-prefix",
          `${name} starts with a keyword and optional keyword marker before a hidden operand selector; try extracting only those two keywords into a non-empty hidden prefix. Leave the operand selector and suffix at the caller to preserve recovery field attachment. Preserve token identities, keyword options, fields, aliases and order, check cross-file references and metadata, then compare actions, table bytes, memory, parsing speed and complete valid and recovery trees before retaining the boundary.`,
        );
      }
    },
  };
}, "Suggest isolating keyword and optional marker prefixes before hidden operand selectors");
