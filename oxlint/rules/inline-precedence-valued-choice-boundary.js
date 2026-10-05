import {
  callName,
  isRuleDisabled,
  isRuleProperty,
  isStaticDsl,
  isStaticKeywordCall,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { rootInlineSymbols } from "../helpers/project-metadata.js";

export const inlinePrecedenceValuedChoiceBoundary = rule((context) => {
  const inlined = rootInlineSymbols(context);
  const properties = [];
  const valuedBranch = (branch) => {
    if (callName(branch) !== "seq" || branch.arguments.length !== 2) return null;
    const [keyword, value] = branch.arguments;
    if (!(memberName(keyword)?.startsWith("_kw_") || isStaticKeywordCall(keyword))) return null;
    if (
      callName(value) !== "field" ||
      value.arguments.length !== 2 ||
      value.arguments[0].type !== "Literal" ||
      typeof value.arguments[0].value !== "string"
    )
      return null;
    return memberName(value.arguments[1]);
  };
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
    "Program:exit"() {
      for (const property of properties) {
        const name = ruleName(property),
          body = property.value.body;
        if (!name.startsWith("_") || !inlined.has(name) || isRuleDisabled(context, property))
          continue;
        if (
          !["prec", "prec.left", "prec.right"].includes(callName(body)) ||
          !(
            (body.arguments.length === 2 &&
              body.arguments[0].type === "Literal" &&
              ["string", "number"].includes(typeof body.arguments[0].value)) ||
            (body.arguments.length === 1 && callName(body) !== "prec")
          ) ||
          !isStaticDsl(body) ||
          isRuleDisabled(context, body)
        )
          continue;
        const choice = body.arguments.at(-1);
        if (
          callName(choice) !== "choice" ||
          choice.arguments.length < 3 ||
          choice.arguments.length > 8 ||
          isRuleDisabled(context, choice)
        )
          continue;
        const values = choice.arguments.map(valuedBranch);
        if (values.some((value) => value === null || value === name)) continue;
        if (new Set(values).size !== 1) continue;
        report(
          context,
          property,
          "inline-precedence-valued-choice-boundary",
          `${name} expands a precedence-wrapped choice of keyword fields sharing one value symbol through grammar.inline; try removing its inline entry to retain a hidden valued-option boundary. Preserve the complete precedence wrapper, keywords, fields and branch order; compare action savings against state and byte costs and validate complete trees before keeping the change.`,
        );
      }
    },
  };
}, "Suggest retaining boundaries for inlined precedence-wrapped homogeneous valued choices");
