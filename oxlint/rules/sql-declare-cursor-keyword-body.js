import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { report, rule } from "../helpers.js";
import { staticSourceTokens, usedOutsideFile } from "../helpers/project-metadata.js";
import { matchStaticRuleLayout } from "../helpers/static-rule-layout.js";

const ruleId = "sql-declare-cursor-keyword-body";
const statement = "declare_cursor_statement";
const body = "__sql_declare_cursor_body";
const select = "select_statement";
const measuredRules = new Map([
  [statement, 'seq(kw("DECLARE"),$.__sql_declare_cursor_body,$._terminator)'],
  [
    body,
    'seq(field("cursor",$.identifier),$._kw_cursor,$._kw_for,field("query",alias($.__sql_select_body,$.select)),optional(choice(alias($.__sql_read_only,$.read_only),alias($.__sql_for_update,$.for_update))))',
  ],
  ["__sql_read_only", 'seq($._kw_for,kw("READ"),kw("ONLY"))'],
  [
    "__sql_for_update",
    'seq($._kw_for,$._kw_update,optional(seq($._kw_of,field("column",$._qualified_identifier),optional($.__sql_for_update_column_tail))))',
  ],
  [
    "__sql_for_update_column_tail",
    'seq(",",field("column",$._qualified_identifier),optional($.__sql_for_update_column_tail))',
  ],
  [select, "seq($.__sql_select_body,$._terminator)"],
  ["__sql_select_body", 'seq(kw("SELECT"),$.__sql_select_projection,$.__sql_select_from_body)'],
]);
const expectedUses = new Map([
  [statement, 0],
  [body, 1],
  ["__sql_read_only", 1],
  ["__sql_for_update", 1],
  ["__sql_for_update_column_tail", 2],
  [select, 0],
  ["__sql_select_body", 2],
  ["select", 1],
  ["read_only", 1],
  ["for_update", 1],
]);
const sharedInputs = [
  "_terminator",
  "identifier",
  "_kw_cursor",
  "_kw_for",
  "_kw_update",
  "_kw_of",
  "_qualified_identifier",
  "select",
  "read_only",
  "for_update",
];
const cursorDispatch = staticSourceTokens(
  "$.declare_cursor_statement, $.open_cursor_statement, $.fetch_statement, $.close_cursor_statement, $.select_statement",
);
const readOnlyFlag = staticSourceTokens('alias(kw("READ-ONLY"), $.read_only)');

function hasMeasuredUses(file, expected, names) {
  try {
    const tokens = staticSourceTokens(readFileSync(file, "utf8"));
    return (
      tokens.some((_, index) =>
        expected.every((token, offset) => tokens[index + offset] === token),
      ) &&
      names.every(
        (name) =>
          tokens.filter((token) => token === name || token.slice(1, -1) === name).length === 1,
      )
    );
  } catch {
    return false;
  }
}

export const sqlDeclareCursorKeywordBody = rule((context) => {
  if (resolve(context.cwd, context.filename) !== resolve(context.cwd, "grammar/statements/sql.js"))
    return {};

  let declareTokens = 0;
  return {
    Literal(node) {
      if (typeof node.value === "string" && node.value.toUpperCase() === "DECLARE") declareTokens++;
    },
    "Program:exit"(program) {
      if (declareTokens !== 1) return;

      const dispatch = resolve(context.cwd, "grammar/core/statements.js");
      const common = resolve(context.cwd, "grammar/core/common.js");
      if (
        !hasMeasuredUses(dispatch, cursorDispatch, [statement, select]) ||
        !hasMeasuredUses(common, readOnlyFlag, ["read_only"]) ||
        usedOutsideFile(context, "DECLARE", { caseInsensitiveLiteral: true })
      )
        return;

      const expectedOutsideFiles = new Map([
        [statement, [dispatch]],
        [select, [dispatch]],
        ["read_only", [common]],
      ]);
      const local = matchStaticRuleLayout(
        context,
        program,
        measuredRules,
        expectedUses,
        expectedOutsideFiles,
      );
      if (!local || sharedInputs.some((name) => local.has(name))) return;

      report(
        context,
        local.get(statement).value.body.arguments[0],
        ruleId,
        "Try moving the required DECLARE keyword into the existing private cursor body. Keep the terminator on the statement and preserve cursor and query fields, aliases, and mode order. Compare parser metrics, parsing speed, and complete valid and recovery trees before retaining the change.",
      );
    },
  };
}, "Suggest placing the DECLARE keyword at the start of the private cursor body");
