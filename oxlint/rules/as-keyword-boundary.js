import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  directiveTargetsRule,
  dslSignature,
  isRuleDisabled,
  isRuleProperty,
  memberName,
  report,
  rule,
  ruleName,
} from "../helpers.js";
import {
  projectPrecedenceSymbols,
  rootMetadataSymbols,
  staticSourceTokens,
  usedOutsideFile,
} from "../helpers/project-metadata.js";

const ruleId = "as-keyword-boundary";
const shared = "_kw_as";
const like = "_kw_like";
const catchInline = "_kw_catch_as";
const catchStatement = "catch_statement";
const catchPrefix = "__catch_prefix";
const relevant = [shared, like, catchInline, catchStatement, catchPrefix];
const keywordOrder = [
  ["_kw_by", "BY"],
  [shared, "AS"],
  ["_kw_no_undo", "NO-UNDO"],
  ["_kw_of", "OF"],
  [like, "LIKE"],
  ["_kw_row", "ROW"],
];
const metadata = [
  "inline",
  "conflicts",
  "precedences",
  "supertypes",
  "externals",
  "extras",
  "word",
];
const tokens = (source) =>
  staticSourceTokens(source).filter(
    (token, index, all) => token !== "," || ![")", "]", "}"].includes(all[index + 1]),
  );
const catchSource = tokens(`export default ({ kw }) => ({
  catch_statement: ($) => seq($.__catch_prefix, $._terminator),
  __catch_prefix: ($) => seq(
    kw("CATCH"), field("name", $.identifier),
    optional(seq($._kw_as, optional($._kw_class), field("type", $._qualified_identifier))),
    $._closed_body, optional(kw("CATCH")),
  ),
});`).join(" ");
const assembly = [
  [
    "grammar.js",
    [
      'import coreStatements from "./grammar/core/statements.js";',
      'import keywordRules, { COMPARISON_OPERATORS, WIDGETS, inline as inlineKeywords } from "./grammar/keywords.js";',
      'import statements from "./grammar/statements/index.js";',
      "inline: ($) => [...inlineKeywords($),",
      "...statements(ctx)",
      "...keywordRules(ctx)",
      "...coreStatements(ctx)",
    ],
    [
      ["inlineKeywords", 2],
      ["statements", 2],
      ["keywordRules", 2],
      ["coreStatements", 2],
    ],
  ],
  [
    "grammar/statements/index.js",
    ['import grammar_catch from "./catch.js";', "...grammar_catch(ctx)"],
    [["grammar_catch", 2]],
  ],
  [
    "grammar/core/statements.js",
    ["$.buffer_copy_statement, $.catch_statement, $.connect_statement"],
    [[catchStatement, 1]],
  ],
].map(([file, fragments, uses]) => [file, fragments.map(tokens), uses]);

function matchesAssembly(source, fragments, uses) {
  if (uses.some(([name, count]) => source.filter((token) => token === name).length !== count))
    return false;
  let offset = 0;
  for (const fragment of fragments) {
    const start = source.findIndex(
      (_, index) =>
        index >= offset && fragment.every((token, part) => source[index + part] === token),
    );
    if (start < 0) return false;
    offset = start + fragment.length;
  }
  return true;
}

function hasMeasuredCatchAssembly(context, catchFile) {
  try {
    const source = readFileSync(catchFile, "utf8");
    const directives = source.matchAll(
      /\b(?:oxlint|eslint)-disable(?:-next-line|-line)?\b([^\r\n*]*)/g,
    );
    if (
      tokens(source).join(" ") !== catchSource ||
      [...directives].some(([, value]) => directiveTargetsRule({ value }, context.id))
    )
      return false;

    return assembly.every(([file, fragments, uses]) =>
      matchesAssembly(tokens(readFileSync(resolve(context.cwd, file), "utf8")), fragments, uses),
    );
  } catch {
    return false;
  }
}

function externalKeywordCollision(source) {
  return source.some((token, index) => {
    if ((token === shared || token === like) && source[index + 1] === ":") return true;
    if (!['"', "'", "`"].includes(token[0]) || token[0] !== token.at(-1)) return false;
    const value = token.slice(1, -1);
    return (
      relevant.includes(value) ||
      value.toUpperCase() === "AS" ||
      (value.toUpperCase() === "LIKE" &&
        source[index - 1] === "(" &&
        ["kw", "token"].includes(source[index - 2]))
    );
  });
}

function measuredKeywordRules(program) {
  const factory = program.body.find(
    (node) => node.type === "ExportDefaultDeclaration",
  )?.declaration;
  if (
    factory?.type !== "ArrowFunctionExpression" ||
    factory.async ||
    factory.params.length !== 1 ||
    factory.params[0].type !== "ObjectPattern" ||
    factory.body.type !== "ObjectExpression"
  )
    return null;
  const [binding, ...other] = factory.params[0].properties;
  if (!binding?.shorthand || binding.value.name !== "kw" || other.length) return null;
  const properties = factory.body.properties;
  const names = properties.map(ruleName);
  if (
    properties.some((property) => property.computed || !ruleName(property)) ||
    new Set(names).size !== properties.length ||
    names.includes(catchInline)
  )
    return null;

  const start = names.indexOf(keywordOrder[0][0]);
  if (start < 0) return null;
  const measured = properties.slice(start, start + keywordOrder.length);
  if (
    !keywordOrder.every(([name, word], index) => {
      const property = measured[index];
      return (
        property &&
        isRuleProperty(property) &&
        ruleName(property) === name &&
        !property.value.async &&
        property.value.params.length === 1 &&
        dslSignature(property.value.body) === `kw(${JSON.stringify(word)})`
      );
    })
  )
    return null;
  return measured;
}

export const asKeywordBoundary = rule((context) => {
  if (resolve(context.cwd, context.filename) !== resolve(context.cwd, "grammar/keywords.js"))
    return {};

  const inlineDeclarations = [];
  const sharedUses = [];
  const keywordLiterals = [];
  let unsafeReference = false;
  return {
    VariableDeclarator(node) {
      if (node.id.name === "inline") inlineDeclarations.push(node);
    },
    MemberExpression(node) {
      if (node.object.type !== "Identifier" || node.object.name !== "$") return;
      const name = memberName(node);
      if (!name || name === like || name === catchInline) unsafeReference = true;
      if (name === shared) sharedUses.push(node);
    },
    Literal(node) {
      if (typeof node.value === "string" && ["AS", "LIKE"].includes(node.value.toUpperCase()))
        keywordLiterals.push(node);
    },
    "Program:exit"(program) {
      const [inline] = inlineDeclarations;
      if (
        unsafeReference ||
        sharedUses.length !== 1 ||
        keywordLiterals.length !== 2 ||
        inlineDeclarations.length !== 1 ||
        inline.parent.parent.type !== "ExportNamedDeclaration" ||
        inline.parent.kind !== "const" ||
        inline.init?.type !== "ArrowFunctionExpression" ||
        inline.init.async ||
        inline.init.params.length !== 1 ||
        inline.init.params[0].name !== "$" ||
        inline.init.body.type !== "ArrayExpression" ||
        !inline.init.body.elements.every(memberName) ||
        !inline.init.body.elements.includes(sharedUses[0])
      )
        return;

      const measured = measuredKeywordRules(program);
      if (
        !measured ||
        [inline, sharedUses[0], ...measured, ...measured.map((node) => node.value.body)].some(
          (node) => isRuleDisabled(context, node),
        )
      )
        return;

      const root = rootMetadataSymbols(context, metadata);
      const precedences = projectPrecedenceSymbols(context);
      if (relevant.some((name) => root.has(name) || precedences.has(name))) return;

      const catchFile = resolve(context.cwd, "grammar/statements/catch.js");
      const core = resolve(context.cwd, "grammar/core/statements.js");
      if (
        !hasMeasuredCatchAssembly(context, catchFile) ||
        usedOutsideFile(context, catchInline, { wholeName: true }) ||
        usedOutsideFile(context, catchPrefix, { wholeName: true, except: [catchFile] }) ||
        usedOutsideFile(context, catchStatement, { wholeName: true, except: [catchFile, core] }) ||
        usedOutsideFile(context, externalKeywordCollision)
      )
        return;

      report(
        context,
        measured[1],
        ruleId,
        "Try retaining the shared AS reduction immediately after LIKE and using a CATCH-only inline reference to the same AS token. Keep the optional CATCH type clause and recovery order intact. Compare parser metrics, parsing speed, and complete valid and recovery trees before retaining the change.",
      );
    },
  };
}, "Suggest retaining the shared AS reduction with a CATCH-specific inline reference");
