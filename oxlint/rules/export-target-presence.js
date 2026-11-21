import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { containsAlternatives, report, rule } from "../helpers.js";
import { rootMetadataSymbols, staticSourceTokens } from "../helpers/project-metadata.js";
import { matchStaticRuleLayout } from "../helpers/static-rule-layout.js";

const ruleId = "export-target-presence";
const statement = "export_statement";
const body = "__export_statement_body";
const head = "__export_statement_head";
const tail = "__export_tail";

const measuredRules = new Map([
  [statement, "seq($.__export_statement_body,$._terminator)"],
  [
    body,
    "seq($.__export_statement_head,optional(seq(optional($.delimiter_phrase),$._expression_list,optional($.__export_tail))))",
  ],
  [head, 'seq(kw("EXPORT"),optional($._stream_phrase))'],
  [
    tail,
    'choice(seq(seq($._kw_except,$._import_export_except_names),optional(alias(kw("NO-LOBS"),$.no_lobs))),alias(kw("NO-LOBS"),$.no_lobs))',
  ],
]);

const expectedUses = new Map([
  [statement, 0],
  [body, 1],
  [head, 1],
  [tail, 1],
]);

const contexts = [
  [
    "grammar.js",
    head,
    [
      "[$.__export_statement_head]",
      '_terminator: ($) => choice($._terminator_dot, ";", $._end_of_file),',
      'import precedences from "./grammar/precedences/index.js"',
      "precedences: ($) => precedences($)",
    ],
  ],
  [
    "grammar/core/statements.js",
    statement,
    ["$.raw_transfer_statement, $.export_statement, $.clear_statement"],
  ],
  [
    "grammar/precedences/export.js",
    statement,
    ["export default ($) => [[$.export_statement, $._expression]]"],
  ],
  [
    "grammar/precedences/index.js",
    null,
    ['import grammar_export from "./export.js"', "...grammar_export($)"],
  ],
  [
    "grammar/core/common.js",
    null,
    [
      '_stream_phrase: ($) => seq(choice($._kw_stream, $._kw_stream_handle), field("stream", $.identifier)),',
      "_expression_list: ($) => prec.right(seq($._expression, optional($._expression_list))),",
      "_import_export_except_names: ($) => prec.right(seq($._qualified_identifier, optional($._import_export_except_names))),",
    ],
  ],
  [
    "grammar/phrases/delimiter.js",
    null,
    ['delimiter_phrase: ($) => seq(kw("DELIMITER"), field("delimiter", $.string_literal)),'],
  ],
].map(([filename, name, snippets]) => [filename, name, snippets.map(staticSourceTokens)]);

function expectedProjectUses(context) {
  if (!rootMetadataSymbols(context, ["conflicts"]).has(head)) return null;

  const files = new Map();
  try {
    for (const [relative, name, snippets] of contexts) {
      const filename = resolve(context.cwd, relative);
      const tokens = staticSourceTokens(readFileSync(filename, "utf8")).filter(
        (token, index, all) => token !== "," || ![")", "]"].includes(all[index + 1]),
      );
      if (!snippets.every((snippet) => containsAlternatives(tokens, snippet))) return null;
      if (name) {
        const occurrences = tokens.filter(
          (token) => (/^["'\x60]/.test(token) ? token.slice(1, -1) : token) === name,
        );
        if (occurrences.length !== 1) return null;
        files.set(name, [...(files.get(name) ?? []), filename]);
      }
    }
  } catch {
    return null;
  }
  return files;
}

export const exportTargetPresence = rule(
  (context) => ({
    "Program:exit"(program) {
      if (
        resolve(context.cwd, context.filename) !==
        resolve(context.cwd, "grammar/statements/export.js")
      )
        return;

      const files = expectedProjectUses(context);
      if (!files) return;
      const local = matchStaticRuleLayout(context, program, measuredRules, expectedUses, files);
      if (local?.size !== measuredRules.size) return;

      report(
        context,
        local.get(body),
        ruleId,
        "Try making the EXPORT targets required in the body and choosing the body or bare head before the shared terminator. Keep the STREAM conflict on the head and preserve the delimiter, expression order, EXCEPT names, and NO-LOBS alias. Compare parser metrics, parsing speed, and complete valid and recovery trees.",
      );
    },
  }),
  "Suggest choosing between the target-bearing EXPORT body and the bare head",
);
