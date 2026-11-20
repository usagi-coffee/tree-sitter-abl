import {
  callName,
  dslSignature,
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
import {
  projectPrecedenceSymbols,
  rootMetadataSymbols,
  usedOutsideFile,
} from "../helpers/project-metadata.js";

const ruleId = "value-declaration-tail-extraction";
const isCall = (node, name, arity) => callName(node) === name && node.arguments.length === arity;

function keywordName(node) {
  if (isStaticKeywordCall(node)) return node.arguments[0].value.toUpperCase();
  const name = memberName(node);
  return name?.startsWith("_kw_") ? name.slice(4).toUpperCase() : null;
}

function fieldName(node) {
  if (!isCall(node, "field", 2) || !memberName(node.arguments[1])) return null;
  const label = node.arguments[0];
  return label.type === "Literal" && typeof label.value === "string" ? label.value : null;
}

function localOptionSequence(definition) {
  const body = definition?.value.body;
  const sequence = callName(body) === "prec.right" ? body.arguments.at(-1) : body;
  return callName(sequence) === "seq" && sequence.arguments.length >= 2;
}

function hasSafeUse(context, use, map) {
  const owner = enclosingRule(use);
  if (!owner || owner.parent !== map) return false;
  for (let part = use; part !== owner; part = part.parent) {
    if (
      isRuleDisabled(context, part) ||
      (part.type === "CallExpression" && !["seq", "choice", "optional"].includes(callName(part)))
    )
      return false;
  }
  return !isRuleDisabled(context, owner);
}

export const valueDeclarationTailExtraction = rule((context) => {
  const declarations = [];
  const references = new Map();
  let dynamicReference = false;
  const suppressed = (node) =>
    isRuleDisabled(context, node) ||
    (node.type === "CallExpression" && node.arguments.some(suppressed));

  return {
    Property(node) {
      if (isRuleProperty(node) && /^__.+_value_body$/.test(ruleName(node))) declarations.push(node);
    },
    MemberExpression(node) {
      if (node.object.type !== "Identifier" || node.object.name !== "$") return;
      const name = memberName(node);
      if (!name) {
        dynamicReference = true;
        return;
      }
      if (!/^__.+_value_body$/.test(name)) return;
      const uses = references.get(name) ?? [];
      uses.push(node);
      references.set(name, uses);
    },
    "Program:exit"() {
      if (dynamicReference) return;
      for (const declaration of declarations) {
        const name = ruleName(declaration);
        const body = declaration.value.body;
        if (!isCall(body, "seq", 4) || !isStaticDsl(body) || suppressed(declaration)) continue;
        const [marker, value, selector, options] = body.arguments;
        if (
          !isCall(marker, "optional", 1) ||
          keywordName(marker.arguments[0]) !== "VALUE" ||
          !fieldName(value) ||
          !isCall(selector, "choice", 2) ||
          !isCall(options, "optional", 1) ||
          !selector.arguments.every((part) => isCall(part, "seq", 2))
        )
          continue;
        const tags = selector.arguments.map((branch) => keywordName(branch.arguments[0]));
        const fields = [value, ...selector.arguments.map((branch) => branch.arguments[1])].map(
          fieldName,
        );
        if (
          !tags.includes("AS") ||
          !tags.includes("LIKE") ||
          fields.some((label) => !label) ||
          new Set(fields).size !== fields.length
        )
          continue;

        const map = declaration.parent;
        const entries = map.properties;
        if (
          entries.some(
            (entry) =>
              !isRuleProperty(entry) ||
              entry.computed ||
              entry.value.async ||
              entry.value.params.length !== 1 ||
              !isStaticDsl(entry.value.body),
          )
        )
          continue;
        const local = new Map(entries.map((entry) => [ruleName(entry), entry]));
        const optionName = memberName(options.arguments[0]);
        const option = local.get(optionName);
        if (
          local.size !== entries.length ||
          !optionName?.startsWith(name.slice(0, -"value_body".length)) ||
          !localOptionSequence(option) ||
          suppressed(body) ||
          suppressed(option) ||
          suppressed(option.value.body)
        )
          continue;

        const uses = references.get(name) ?? [];
        if (uses.length < 2 || uses.some((use) => !hasSafeUse(context, use, map))) continue;
        const seen = new Set();
        const reachesDeclaration = (symbol) => {
          if (symbol === name) return true;
          const definition = local.get(symbol);
          if (!definition || seen.has(symbol)) return false;
          seen.add(symbol);
          return referencedSymbols(definition.value.body).some(reachesDeclaration);
        };
        if (
          referencedSymbols(body).some(reachesDeclaration) ||
          usedOutsideFile(context, name, { wholeName: true })
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
          [name, optionName, ...uses.map((use) => ruleName(enclosingRule(use)))].some((symbol) =>
            restricted.has(symbol),
          )
        )
          continue;

        const tail = [selector, options].map(dslSignature);
        if (
          entries.some((entry) => {
            const candidate = entry.value.body;
            return (
              isCall(candidate, "seq", 2) &&
              candidate.arguments.every((part, index) => dslSignature(part) === tail[index])
            );
          })
        )
          continue;

        report(
          context,
          selector,
          ruleId,
          `Try extracting the required AS or LIKE choice and its optional value options in ${name} into one hidden tail. Keep the optional VALUE marker, value field, and caller prefixes in place. Preserve field names, keyword options, alternative order, and precedence. Compare parser metrics, parsing speed, and complete valid and recovery trees.`,
        );
      }
    },
  };
}, "Suggest extracting a required value type choice together with its optional options");
