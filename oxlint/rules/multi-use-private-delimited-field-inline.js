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
import { projectPrecedenceSymbols, rootMetadataSymbols } from "../helpers/project-metadata.js";

export const multiUsePrivateDelimitedFieldInline = rule((context) => {
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
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
    },
    MemberExpression(node) {
      const name = memberName(node);
      if (!name) {
        if (node.computed && node.object.type === "Identifier" && node.object.name === "$")
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
      const pairs = { "(": ")", "[": "]", "{": "}" };
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (
          !name.startsWith("__") ||
          restricted.has(name) ||
          isRuleDisabled(context, property) ||
          isRuleDisabled(context, body) ||
          callName(body) !== "seq" ||
          body.arguments.length !== 3 ||
          !isStaticDsl(body)
        )
          continue;
        const [open, value, close] = body.arguments;
        if (
          open.type !== "Literal" ||
          close.type !== "Literal" ||
          !Object.hasOwn(pairs, open.value) ||
          pairs[open.value] !== close.value ||
          callName(value) !== "field" ||
          value.arguments.length !== 2 ||
          value.arguments[0].type !== "Literal" ||
          typeof value.arguments[0].value !== "string" ||
          !memberName(value.arguments[1]) ||
          referencedSymbols(body).includes(name) ||
          [open, value, value.arguments[1], close].some((node) => isRuleDisabled(context, node))
        )
          continue;
        const uses = references.get(name) ?? [];
        if (uses.length < 2) continue;
        if (
          !uses.every((use) => {
            const owner = enclosingRule(use);
            if (
              !owner ||
              owner === property ||
              owner.parent !== property.parent ||
              isRuleDisabled(context, owner)
            )
              return false;
            for (let parent = use; parent !== owner; parent = parent.parent) {
              if (isRuleDisabled(context, parent)) return false;
              if (
                parent.type === "CallExpression" &&
                (![
                  "seq",
                  "choice",
                  "optional",
                  "repeat",
                  "repeat1",
                  "prec",
                  "prec.left",
                  "prec.right",
                ].includes(callName(parent)) ||
                  !isStaticDsl(parent))
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
          "multi-use-private-delimited-field-inline",
          `${name} contains one delimited field and has ${uses.length} unaliased local uses; try adding it to grammar.inline. Preserve both delimiters, the field, call-site optionality, aliases and precedence. Check cross-file references and metadata, then compare actions, table bytes, memory and parsing speed, and verify complete valid and recovery trees before retaining the change.`,
        );
      }
    },
  };
}, "Suggest inlining repeatedly used private sequences containing one delimited field");
