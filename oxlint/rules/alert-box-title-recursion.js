import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { containsAlternatives, report, rule } from "../helpers.js";
import {
  rootInlineSymbols,
  staticSourceTokens,
  usedOutsideFile,
} from "../helpers/project-metadata.js";
import { matchStaticRuleLayout } from "../helpers/static-rule-layout.js";

const ruleId = "alert-box-title-recursion";
const options = "_alert_box_options";
const afterType = "_alert_box_after_type";
const title = "_alert_box_title";
const value = "_alert_box_title_value";
const concatenation = "_alert_box_title_concatenation";
const tail = "_alert_box_title_concatenation_tail";
const message = "__message_view_as_phrase";
const viewAs = "__view_as_alert_box";
const precedence = "alert_title";
const precedenceFile = "grammar/precedences/index.js";

const measuredRules = new Map([
  [
    options,
    "choice(seq(alias($._alert_type,$.alert_type),optional($._alert_box_after_type)),$._alert_box_after_type)",
  ],
  [
    afterType,
    "choice(seq($._alert_buttons_phrase,optional($._alert_box_title)),$._alert_box_title)",
  ],
  [title, 'seq($._kw_title,field("title",$._alert_box_title_value))'],
  [value, "choice($._text_operand,alias($._alert_box_title_concatenation,$.binary_expression))"],
  [
    concatenation,
    'prec.right("alert_title",seq($._text_operand,$._alert_box_title_concatenation_tail))',
  ],
  [
    tail,
    'prec.right("alert_title",seq("+",$._text_operand,optional($._alert_box_title_concatenation_tail)))',
  ],
  ["_text_operand", "choice($.string_literal,$._identifier_or_access_or_call)"],
]);

const expectedUses = new Map([
  [options, 0],
  [afterType, 2],
  [title, 2],
  [value, 1],
  [concatenation, 1],
  [tail, 2],
  [message, 0],
  [viewAs, 0],
]);

const projectContexts = [
  [
    "grammar.js",
    [[value, 1]],
    [
      'import precedences from "./grammar/precedences/index.js"',
      "precedences: ($) => precedences($)",
    ],
  ],
  [
    precedenceFile,
    [
      [title, 1],
      [value, 1],
      [precedence, 1],
    ],
    ['["alert_title", $._alert_box_title, $._alert_box_title_value, $._text_operand]'],
  ],
  [
    "grammar/statements/message.js",
    [
      [options, 1],
      [message, 2],
    ],
    [
      '__message_view_as_phrase: ($) => seq(kw("VIEW-AS"), kw("ALERT-BOX"), optional($._alert_box_options))',
      "seq(alias($.__message_view_as_phrase, $.view_as_phrase), optional($.__message_window_tail))",
    ],
  ],
  [
    "grammar/phrases/view-as.js",
    [
      [options, 1],
      [viewAs, 1],
    ],
    [
      '__view_as_alert_box: ($) => seq(field("widget", kw("ALERT-BOX")), optional($._alert_box_options))',
    ],
  ],
  ["grammar/phrases/format.js", [[viewAs, 1]], ["alias($.__view_as_alert_box, $.view_as_phrase)"]],
].map(([filename, counts, snippets]) => [filename, counts, snippets.map(staticSourceTokens)]);

function countName(tokens, name) {
  return tokens.filter((token) => (/^["'`]/.test(token) ? token.slice(1, -1) : token) === name)
    .length;
}

function expectedProjectUses(cwd) {
  const files = new Map();
  try {
    for (const [relative, counts, snippets] of projectContexts) {
      const filename = resolve(cwd, relative);
      const tokens = staticSourceTokens(readFileSync(filename, "utf8")).filter(
        (token, index, all) => token !== "," || ![")", "]"].includes(all[index + 1]),
      );
      if (!snippets.every((snippet) => containsAlternatives(tokens, snippet))) return null;
      for (const [name, count] of counts) {
        if (countName(tokens, name) !== count) return null;
        files.set(name, [...(files.get(name) ?? []), filename]);
      }
    }
  } catch {
    return null;
  }
  return files;
}

export const alertBoxTitleRecursion = rule(
  (context) => ({
    "Program:exit"(program) {
      if (
        resolve(context.cwd, context.filename) !== resolve(context.cwd, "grammar/core/common.js") ||
        !rootInlineSymbols(context).has(value)
      )
        return;

      const localSource = staticSourceTokens(context.sourceCode.getText());
      const files = expectedProjectUses(context.cwd);
      if (
        !files ||
        countName(localSource, precedence) !== 2 ||
        usedOutsideFile(context, precedence, { wholeName: true, except: files.get(precedence) })
      )
        return;

      const local = matchStaticRuleLayout(context, program, measuredRules, expectedUses, files);
      if (!local) return;

      report(
        context,
        local.get(concatenation),
        ruleId,
        "Try reusing the hidden ALERT-BOX TITLE concatenation for right recursion and removing the separate tail. Keep the outer binary_expression alias, TITLE field, and named alert_title precedence. Measure parser metrics, parsing speed, and complete valid and recovery trees.",
      );
    },
  }),
  "Suggest reusing the hidden ALERT-BOX TITLE concatenation for right recursion",
);
