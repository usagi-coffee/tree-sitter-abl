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
import {
  projectPrecedenceSymbols,
  rootInlineSymbols,
  rootMetadataSymbols,
} from "../helpers/project-metadata.js";

export const inlineClauseChoiceBoundary = rule((context) => {
  const inlined = rootInlineSymbols(context),
    restricted = rootMetadataSymbols(context, ["conflicts", "supertypes", "externals", "word"]),
    properties = [];
  for (const name of projectPrecedenceSymbols(context)) restricted.add(name);
  let dynamicReference = false;
  return {
    Property(node) {
      if (isRuleProperty(node)) properties.push(node);
      if (ruleName(node) === "inline" && node.value?.body?.type === "ArrayExpression") {
        for (const element of node.value.body.elements) {
          const name = memberName(element);
          if (name) inlined.add(name);
        }
      }
    },
    MemberExpression(node) {
      const name = memberName(node);
      if (!name) {
        if (node.computed && node.object.type === "Identifier" && node.object.name === "$")
          dynamicReference = true;
        return;
      }
      const owner = enclosingRule(node);
      for (let parent = node.parent; parent && parent !== owner; parent = parent.parent) {
        if (["alias", "token", "token.immediate", "prec.dynamic"].includes(callName(parent)))
          restricted.add(name);
        if (
          !owner &&
          parent.type === "Property" &&
          ["conflicts", "precedences", "supertypes", "externals", "word"].includes(ruleName(parent))
        )
          restricted.add(name);
      }
    },
    "Program:exit"() {
      if (dynamicReference) return;
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (
          !name.startsWith("_") ||
          !inlined.has(name) ||
          restricted.has(name) ||
          isRuleDisabled(context, property) ||
          isRuleDisabled(context, body) ||
          callName(body) !== "choice" ||
          body.arguments.length < 2 ||
          body.arguments.length > 7 ||
          !isStaticDsl(body) ||
          referencedSymbols(body).includes(name)
        )
          continue;
        let fieldBranch = false,
          helperBranch = false;
        const matches = body.arguments.every((branch) => {
          if (callName(branch) !== "seq" || branch.arguments.length !== 2) return false;
          const [keyword, value] = branch.arguments;
          if (!(memberName(keyword)?.startsWith("_kw_") || isStaticKeywordCall(keyword)))
            return false;
          const helper = memberName(value);
          if (helper?.startsWith("_") && !helper.startsWith("_kw_")) {
            helperBranch = true;
            return true;
          }
          if (
            callName(value) !== "field" ||
            value.arguments.length !== 2 ||
            value.arguments[0].type !== "Literal" ||
            typeof value.arguments[0].value !== "string" ||
            !memberName(value.arguments[1])
          )
            return false;
          fieldBranch = true;
          return true;
        });
        if (!matches || !fieldBranch || !helperBranch) continue;
        report(
          context,
          property,
          "inline-clause-choice-boundary",
          `${name} expands a small keyword-clause choice mixing hidden bodies and direct fields through grammar.inline; try removing its inline entry to retain a hidden clause boundary. Preserve each keyword, helper, field and branch order, check cross-file aliases and metadata, then compare action savings against state and byte costs and validate complete trees.`,
        );
      }
    },
  };
}, "Suggest retaining boundaries for small inlined choices of heterogeneous keyword clauses");
