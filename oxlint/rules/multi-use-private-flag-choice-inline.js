import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  callName,
  enclosingRule,
  isRuleDisabled,
  isRuleProperty,
  isStaticDsl,
  isStaticKeywordCall,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import { projectPrecedenceSymbols, rootMetadataSymbols } from "../helpers/project-metadata.js";

export const multiUsePrivateFlagChoiceInline = rule((context) => {
  const properties = [],
    references = new Map(),
    restricted = rootMetadataSymbols(context, [
      "inline",
      "conflicts",
      "supertypes",
      "externals",
      "word",
      "extras",
    ]);
  for (const name of projectPrecedenceSymbols(context)) restricted.add(name);
  try {
    const root = resolve(context.cwd, "grammar.js");
    const source =
      resolve(context.filename) === root
        ? context.sourceCode.getText()
        : readFileSync(root, "utf8");
    const tokens = (
      source.match(
        /\/\*[\s\S]*?\*\/|\/\/[^\r\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|[$A-Z_a-z][$\w]*|=>|[^\s]/g,
      ) ?? []
    ).filter((part) => !part.startsWith("//") && !part.startsWith("/*"));
    for (let index = 0; index < tokens.length - 8; index++) {
      if (
        tokens[index] === "word" &&
        tokens.slice(index + 1, index + 8).join(" ") === ": ( $ ) => $ ." &&
        /^[$A-Z_a-z][$\w]*$/.test(tokens[index + 8])
      )
        restricted.add(tokens[index + 8]);
    }
  } catch {}
  let dynamicReference = false;
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
          isRuleDisabled(context, body) ||
          callName(body) !== "choice" ||
          body.arguments.length < 2 ||
          body.arguments.length > 8 ||
          !body.arguments.every((branch) => {
            if (
              callName(branch) !== "alias" ||
              branch.arguments.length !== 2 ||
              isRuleDisabled(context, branch)
            )
              return false;
            const [keyword, target] = branch.arguments,
              targetName = memberName(target);
            return (
              (isStaticKeywordCall(keyword) || memberName(keyword)?.startsWith("_kw_")) &&
              targetName &&
              !targetName.startsWith("_") &&
              !isRuleDisabled(context, keyword) &&
              !isRuleDisabled(context, target)
            );
          })
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
              isRuleDisabled(context, owner) ||
              isRuleDisabled(context, use)
            )
              return false;
            for (let parent = use.parent; parent !== owner; parent = parent.parent) {
              if (isRuleDisabled(context, parent)) return false;
              if (parent === owner.value) continue;
              if (
                ![
                  "seq",
                  "choice",
                  "field",
                  "optional",
                  "repeat",
                  "repeat1",
                  "prec",
                  "prec.left",
                  "prec.right",
                ].includes(callName(parent)) ||
                !isStaticDsl(parent)
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
          "multi-use-private-flag-choice-inline",
          `${name} has ${uses.length} unaliased local uses of a private choice made entirely of named keyword flags; try adding it to grammar.inline. Retain the complete helper and preserve keyword options, alias targets, alternative order and caller fields. Check cross-file uses and metadata, measure LARGE_STATE_COUNT before ACTION_COUNT, and compare complete valid and recovery trees.`,
        );
      }
    },
  };
}, "Suggest metadata inlining of multiply used private choices of named keyword flags");
