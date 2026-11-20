import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isStaticDsl,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { projectPrecedenceSymbols, rootMetadataSymbols } from "../helpers/project-metadata.js";

const selector = "_identifier_or_string_literal";
const helper = "_identifier_or_string_literal_value";
const ruleId = "shared-field-scalar-choice";
const fieldAncestors = new Set([
  "seq",
  "choice",
  "optional",
  "repeat",
  "repeat1",
  "prec",
  "prec.left",
  "prec.right",
]);

function hasValueHelper(context) {
  const root = resolve(context.cwd, "grammar.js");
  let source;
  try {
    source =
      resolve(context.cwd, context.filename) === root
        ? context.sourceCode.getText()
        : readFileSync(root, "utf8");
  } catch {
    return false;
  }
  const tokens = (
    source.match(
      /\/\*[\s\S]*?\*\/|\/\/[^\r\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|[$A-Z_a-z][$\w]*|=>|[^\s]/g,
    ) ?? []
  ).filter((token) => !token.startsWith("//") && !token.startsWith("/*"));
  const hasDefinition = (name, body) => {
    const keys = [name, `"${name}"`, `'${name}'`];
    const definitions = tokens.flatMap((token, index) =>
      keys.includes(token) && tokens[index + 1] === ":" ? [index] : [],
    );
    if (definitions.length !== 1) return false;
    const start = definitions[0] + 2;
    const end = start + body.split(" ").length;
    return tokens.slice(start, end).join(" ") === body && [",", "}"].includes(tokens[end]);
  };
  if (
    !hasDefinition(selector, "( $ ) => choice ( $ . identifier , $ . string_literal )") ||
    !hasDefinition(helper, `( $ ) => $ . ${selector}`) ||
    hasDefinition("word", `( $ ) => $ . ${helper}`)
  )
    return false;
  const inline = rootMetadataSymbols(context, ["inline"]);
  const restricted = rootMetadataSymbols(context, [
    "conflicts",
    "supertypes",
    "externals",
    "extras",
  ]);
  return (
    inline.has(selector) &&
    !inline.has(helper) &&
    !restricted.has(helper) &&
    !projectPrecedenceSymbols(context).has(helper)
  );
}

export const sharedFieldScalarChoice = rule((context) => {
  const fieldsByRule = new Map();
  return {
    CallExpression(node) {
      if (callName(node) !== "choice" || node.arguments.length < 3) return;
      const field = node.parent;
      if (callName(field) !== "field" || field.arguments.length !== 2) return;
      const [label, value] = field.arguments;
      if (
        value !== node ||
        label.type !== "Literal" ||
        typeof label.value !== "string" ||
        !label.value
      )
        return;
      const alternatives = node.arguments.map(memberName);
      const pairIndex = alternatives.indexOf("identifier");
      if (
        pairIndex < 0 ||
        alternatives[pairIndex + 1] !== "string_literal" ||
        alternatives.some((name) => !name || name === helper || name === selector) ||
        new Set(alternatives).size !== alternatives.length
      )
        return;
      const owner = enclosingRule(field);
      if (
        !owner ||
        owner.computed ||
        owner.value.async ||
        owner.value.params.length !== 1 ||
        !isStaticDsl(owner.value.body) ||
        [owner, field, node, ...node.arguments].some((part) => isRuleDisabled(context, part))
      )
        return;
      for (let part = field; part.parent !== owner.value; part = part.parent) {
        const parent = part.parent;
        const wrapper = callName(parent);
        if (!fieldAncestors.has(wrapper) || isRuleDisabled(context, parent)) return;
        if (wrapper.startsWith("prec") && parent.arguments.at(-1) !== part) return;
      }
      const fields = fieldsByRule.get(owner) ?? new Map();
      if (!fields.has(label.value)) fields.set(label.value, field);
      fieldsByRule.set(owner, fields);
    },
    "Program:exit"() {
      const groups = [...fieldsByRule].filter(([, fields]) => fields.size > 1);
      if (!groups.length || !hasValueHelper(context)) return;
      for (const [owner, fields] of groups) {
        const name = ruleName(owner);
        if (
          owner.parent.properties.some(
            (entry) =>
              entry.type === "SpreadElement" ||
              entry.computed ||
              (entry !== owner && [name, helper, selector].includes(ruleName(entry))),
          )
        )
          continue;
        report(
          context,
          fields.values().next().value,
          ruleId,
          `${name} repeats adjacent identifier and string literal alternatives in the named fields ${[...fields.keys()].join(", ")}. Try replacing each adjacent pair with $.${helper} while preserving field scope, alternative order, and precedence. Compare parser metrics, parsing speed, and complete valid and recovery trees.`,
        );
      }
    },
  };
}, "Suggest reusing the shared identifier and string literal helper in repeated named field choices");
