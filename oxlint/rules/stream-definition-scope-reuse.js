import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { report, rule } from "../helpers.js";
import {
  keywordInlineSymbols,
  projectPrecedenceSymbols,
  rootMetadataSymbols,
  staticSourceTokens,
} from "../helpers/project-metadata.js";
import { matchStaticRuleLayout } from "../helpers/static-rule-layout.js";

const ruleId = "stream-definition-scope-reuse";
const definitionName = "stream_definition";
const prefixName = "__stream_prefix";
const modifierName = "__stream_modifier";
const sharedName = "_definition_scope_modifier";
const newAlias = "alias($._kw_new,$.new_modifier)";
const globalAlias = 'alias(kw("GLOBAL"),$.scope_modifier)';
const sharedAlias = 'alias(kw("SHARED"),$.scope_modifier)';
const privateAlias = 'alias(kw("PRIVATE"),$.access_modifier)';
const measuredRules = new Map([
  [definitionName, "seq($.__stream_prefix,$._terminator)"],
  [
    prefixName,
    'seq($._kw_define,optional($.__stream_modifier),$._kw_stream,field("name",$.identifier))',
  ],
  [
    modifierName,
    `choice(seq(${newAlias},optional(${globalAlias}),${sharedAlias}),${sharedAlias},${privateAlias})`,
  ],
]);
const expectedUses = new Map([
  [prefixName, 1],
  [modifierName, 1],
]);
const sharedInputs = [
  sharedName,
  "_kw_define",
  "_kw_new",
  "_kw_stream",
  "_terminator",
  "identifier",
  "new_modifier",
  "scope_modifier",
  "access_modifier",
];
const sensitiveRules = [...measuredRules.keys(), sharedName];
const sharedModuleHead = staticSourceTokens("export default ({ kw }) => ({");
const expectedSharedRule = staticSourceTokens(
  `${sharedName}: ($) => choice(seq(${newAlias},${sharedAlias}),${sharedAlias},${privateAlias})`,
);
const sharedKeys = new Set([sharedName, `"${sharedName}"`, `'${sharedName}'`]);

function hasMeasuredSharedScope(context) {
  let code;
  try {
    const source = readFileSync(resolve(context.cwd, "grammar/core/common.js"), "utf8");
    const tokens = staticSourceTokens(source);
    code = tokens.filter((token, index) => token !== "," || tokens[index + 1] !== ")");
  } catch {
    return false;
  }
  if (!sharedModuleHead.every((token, index) => code[index] === token)) return false;

  let depth = 1;
  let sharedRuleIndex = -1;
  for (let index = sharedModuleHead.length; index < code.length; index++) {
    const token = code[index];
    if (depth === 1 && (index === sharedModuleHead.length || code[index - 1] === ",")) {
      const next = code[index + 1];
      if (["[", ".", "*"].includes(token) || (token === "async" && next === "*")) return false;
      const key = ["get", "set", "async"].includes(token) ? next : token;
      if (sharedKeys.has(key)) {
        if (sharedRuleIndex !== -1 || token !== sharedName || next !== ":") return false;
        sharedRuleIndex = index;
      }
    }
    if ("({[".includes(token)) depth++;
    if (")}]".includes(token)) depth--;
    if (depth === 0) {
      return (
        ["} ) ;", "} )"].includes(code.slice(index).join(" ")) &&
        sharedRuleIndex !== -1 &&
        expectedSharedRule.every((token, offset) => code[sharedRuleIndex + offset] === token) &&
        [",", "}"].includes(code[sharedRuleIndex + expectedSharedRule.length])
      );
    }
  }
  return false;
}

export const streamDefinitionScopeReuse = rule(
  (context) => ({
    "Program:exit"(program) {
      if (
        resolve(context.cwd, context.filename) !==
        resolve(context.cwd, "grammar/statements/stream.js")
      )
        return;
      const local = matchStaticRuleLayout(context, program, measuredRules, expectedUses);
      if (
        !local ||
        sharedInputs.some((name) => local.has(name)) ||
        !hasMeasuredSharedScope(context)
      )
        return;

      const root = rootMetadataSymbols(context, [
        "conflicts",
        "externals",
        "supertypes",
        "extras",
        "word",
      ]);
      const inline = keywordInlineSymbols(context);
      const precedence = projectPrecedenceSymbols(context);
      if (sensitiveRules.some((name) => root.has(name) || inline.has(name) || precedence.has(name)))
        return;

      report(
        context,
        local.get(modifierName),
        ruleId,
        "Try reusing _definition_scope_modifier for NEW SHARED, SHARED, and PRIVATE. Keep NEW GLOBAL SHARED explicit to preserve missing-NEW insertion recovery. Preserve the modifier aliases and declaration name field. Compare parser metrics, parsing speed, and complete valid and recovery trees before retaining the change.",
      );
    },
  }),
  "Suggest reusing the shared declaration scope for STREAM modifiers",
);
