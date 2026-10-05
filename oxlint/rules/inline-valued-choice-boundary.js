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
  unwrap,
} from "../helpers.js";
import { rootInlineSymbols } from "../helpers/project-metadata.js";

export const inlineValuedChoiceBoundary = rule((context) => {
  const inlined = rootInlineSymbols(context);
  const properties = [];
  const valuedBranch = (branch) => {
    if (callName(branch) !== "seq" || branch.arguments.length !== 2) return false;
    const [keyword, value] = branch.arguments;
    return (
      (memberName(keyword)?.startsWith("_kw_") || isStaticKeywordCall(keyword)) &&
      callName(value) === "field" &&
      value.arguments.length === 2 &&
      value.arguments[0].type === "Literal" &&
      typeof value.arguments[0].value === "string" &&
      memberName(value.arguments[1]) !== null
    );
  };
  const symbolBranch = (branch) => {
    for (
      let current = branch;
      current?.type === "CallExpression";
      current = current.arguments.at(-1)
    ) {
      if (callName(current) === "prec.dynamic") return false;
      if (!["prec", "prec.left", "prec.right"].includes(callName(current))) break;
    }
    const value = unwrap(branch);
    return (
      memberName(value) !== null ||
      (callName(value) === "alias" && memberName(value.arguments[0]) !== null)
    );
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
        const name = ruleName(property);
        const body = property.value.body;
        if (!name.startsWith("_") || !inlined.has(name) || isRuleDisabled(context, property))
          continue;
        if (callName(body) !== "choice" || body.arguments.length < 8 || !isStaticDsl(body))
          continue;
        if (body.arguments.filter(valuedBranch).length < 2) continue;
        if (!body.arguments.some(symbolBranch)) continue;
        if (!body.arguments.every((branch) => valuedBranch(branch) || symbolBranch(branch)))
          continue;
        report(
          context,
          property,
          "inline-valued-choice-boundary",
          `${name} mixes valued keyword clauses and symbol alternatives through grammar.inline; try removing its inline entry to retain a hidden option boundary. Preserve every keyword, field scope, alias and precedence; compare action counts against state and byte costs and validate complete trees before keeping the change.`,
        );
      }
    },
  };
}, "Suggest retaining hidden boundaries for broad inlined choices of valued clauses and symbols");
