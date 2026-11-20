import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
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

const isCall = (node, name, count) => callName(node) === name && node.arguments.length === count;
const literal = (node, value) => node?.type === "Literal" && node.value === value;
const optional = (node) => (isCall(node, "optional", 1) ? node.arguments[0] : null);
const privateName = (node) => {
  const name = memberName(node);
  return name?.startsWith("__") ? name : null;
};

function isVariableKeyword(node) {
  if (
    !isStaticKeywordCall(node) ||
    !isCall(node, "kw", 2) ||
    !literal(node.arguments[0], "VARIABLE")
  )
    return false;
  const [offset, ...others] = node.arguments[1].properties;
  return (
    offset?.key.type === "Identifier" &&
    offset.key.name === "offset" &&
    literal(offset.value, 3) &&
    others.length === 0
  );
}

function isField(node, label, value) {
  return (
    isCall(node, "field", 2) &&
    literal(node.arguments[0], label) &&
    memberName(node.arguments[1]) === value
  );
}

function isDeclarationBody(body, local) {
  if (!isCall(body, "seq", 5)) return false;
  const [name, extents, noUndo, type, options] = body.arguments;
  const flag = optional(noUndo);
  if (
    !isField(name, "name", "identifier") ||
    !local.has(privateName(optional(extents))) ||
    !local.has(privateName(optional(options))) ||
    !isCall(flag, "alias", 2) ||
    memberName(flag.arguments[0]) !== "_kw_no_undo" ||
    memberName(flag.arguments[1]) !== "no_undo" ||
    !isCall(type, "choice", 2)
  )
    return false;
  const [as, like] = type.arguments;
  return (
    isCall(as, "seq", 2) &&
    memberName(as.arguments[0]) === "_kw_as" &&
    memberName(as.arguments[1]) === "_class_type" &&
    isCall(like, "seq", 2) &&
    memberName(like.arguments[0]) === "_kw_like" &&
    isField(like.arguments[1], "like", "_identifier_or_array_access")
  );
}

export const variableKeywordBodyBoundary = rule((context) => {
  const properties = [];
  const references = new Map();
  let computedReference = false;
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
        computedReference = true;
        return;
      }
      const uses = references.get(name) ?? [];
      uses.push(node);
      references.set(name, uses);
    },
    "Program:exit"() {
      if (computedReference) return;
      let restricted;
      for (const prefix of properties) {
        const name = ruleName(prefix);
        const sequence = prefix.value.body;
        if (!name.startsWith("__") || !isCall(sequence, "seq", 4)) continue;
        const [define, modifier, keyword, use] = sequence.arguments;
        const bodyName = privateName(use);
        const modifierName = privateName(optional(modifier));
        if (
          memberName(define) !== "_kw_define" ||
          !modifierName ||
          !isVariableKeyword(keyword) ||
          !bodyName ||
          bodyName === name ||
          references.get(bodyName)?.length !== 1 ||
          references.get(name)?.length !== 1
        )
          continue;

        const [prefixUse] = references.get(name);
        const wrapper = enclosingRule(prefixUse);
        const statement = wrapper?.value.body;
        if (
          wrapper?.parent !== prefix.parent ||
          ruleName(wrapper) !== "variable_definition" ||
          !isCall(statement, "seq", 2) ||
          statement.arguments[0] !== prefixUse ||
          memberName(statement.arguments[1]) !== "_terminator"
        )
          continue;

        const entries = prefix.parent.properties;
        const local = new Map(
          properties
            .filter((item) => item.parent === prefix.parent)
            .map((item) => [ruleName(item), item]),
        );
        if (
          entries.some((entry) => entry.type === "SpreadElement" || entry.computed) ||
          local.size !== entries.length ||
          !local.has(modifierName)
        )
          continue;
        const declaration = local.get(bodyName);
        const body = declaration?.value.body;
        if (
          !isDeclarationBody(body, local) ||
          [prefix, sequence, declaration, body, wrapper, statement].some(suppressed)
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
          [name, bodyName, ruleName(wrapper)].some((symbol) => restricted.has(symbol)) ||
          usedOutsideFile(context, bodyName, { wholeName: true })
        )
          continue;

        report(
          context,
          keyword,
          "variable-keyword-body-boundary",
          "Try moving the VARIABLE keyword into the retained declaration body. Preserve its abbreviation, DEFINE and scope modifiers, the name and type fields, and the terminator. Compare parser metrics, speed, and complete valid and recovery trees.",
        );
      }
    },
  };
}, "Suggest moving the VARIABLE keyword into its single-use declaration body");
