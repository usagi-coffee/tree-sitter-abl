import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { requiredClauseSelectorExtraction } from "../oxlint/index.js";

const name = "required-clause-selector-extraction";
const event = 'field("event", $._text_operand)';
const inPhrase = "alias($.__subscribe_in_phrase, $.in_phrase)";
const anywhere = 'alias(kw("ANYWHERE"), $.anywhere)';
const choice = `choice(${inPhrase}, ${anywhere})`;
const handler = "optional(alias($.__subscribe_run_procedure_phrase, $.run_procedure_phrase))";
const prefix = "__subscribe_prefix";
const prefixStart = `${prefix}: ($) => seq(`;
const publisherClause = 'seq($._kw_in, field("publisher", $._text_operand))';
const before = `export default ({ kw }) => ({
  subscribe_statement: ($) => seq($.${prefix}, $._no_error_terminator),
  ${prefixStart}
    kw("SUBSCRIBE"),
    optional(seq($._kw_procedure, field("subscriber", $._text_operand))),
    optional($._kw_to),
    ${event},
    ${choice},
    ${handler},
  ),
  __subscribe_in_phrase: ($) => ${publisherClause},
  __subscribe_run_procedure_phrase: ($) =>
    seq(kw("RUN-PROCEDURE"), field("procedure", $._text_operand)),
});`;
const after = before
  .replace(choice, "$.__subscribe_publisher")
  .replace(
    "__subscribe_in_phrase:",
    `__subscribe_publisher: ($) => ${choice},\n  __subscribe_in_phrase:`,
  );

const directory = mkdtempSync(join(tmpdir(), "abl-required-clause-selector-"));
const rootPath = join(directory, "grammar.js");
const test = (description, code = before) => ({
  name: description,
  code,
  cwd: directory,
  filename: join(directory, "grammar", "statements", "subscribe.js"),
});
const warning = {
  message:
    /extracting only the required clause and keyword choice.*__subscribe_prefix.*following optional clause/,
};

try {
  writeFileSync(
    rootPath,
    `export default grammar({ precedences: ($) => [[$.${prefix}, $._qualified_identifier]] });`,
  );
  new RuleTester().run(name, requiredClauseSelectorExtraction, {
    valid: [
      test("selector already has a hidden boundary", after),
      test("selector is optional", before.replace(choice, `optional(${choice})`)),
      test("selector is a field value", before.replace(choice, `field("target", ${choice})`)),
      test(
        "selector precedes the event field",
        before.replace(`${event},\n    ${choice}`, `${choice},\n    ${event}`),
      ),
      test("selector is last", before.replace(`    ${handler},\n`, "")),
      test(
        "optional clause is not aliased",
        before.replace(handler, "optional($.__subscribe_run_procedure_phrase)"),
      ),
      test(
        "final clause is required",
        before.replace(
          handler,
          "alias($.__subscribe_run_procedure_phrase, $.run_procedure_phrase)",
        ),
      ),
      test("event field name is dynamic", before.replace('"event"', "eventName")),
      test(
        "event value is compound",
        before.replace(event, 'field("event", choice($.identifier, $.string_literal))'),
      ),
      test(
        "selector has an extra branch",
        before.replace(anywhere, `${anywhere}, alias(kw("ELSEWHERE"), $.elsewhere)`),
      ),
      test("selector alias is hidden", before.replace("$.anywhere", "$._anywhere")),
      test("selector aliases collide", before.replace("$.anywhere", "$.in_phrase")),
      test(
        "static keyword options are dynamic",
        before.replace('kw("ANYWHERE")', 'kw("ANYWHERE", getOptions())'),
      ),
      test("keyword branch is lexical", before.replace('kw("ANYWHERE")', 'token("ANYWHERE")')),
      test(
        "compound branch is not local",
        before.replace("$.__subscribe_in_phrase,", "$._global_in_phrase,"),
      ),
      test(
        "compound branch is wrapped in precedence",
        before.replace(publisherClause, `prec.right(${publisherClause})`),
      ),
      test(
        "compound branch refers to its own rule",
        before.replace(
          publisherClause,
          publisherClause.replace("$._text_operand", "$.__subscribe_in_phrase"),
        ),
      ),
      test(
        "required and optional clauses share one source",
        before.replace("$.__subscribe_run_procedure_phrase,", "$.__subscribe_in_phrase,"),
      ),
      test(
        "statement aliases the prefix",
        before.replace(`seq($.${prefix},`, `seq(alias($.${prefix}, $.subscribe_prefix),`),
      ),
      test(
        "prefix has an alias use elsewhere",
        before.replace(
          prefixStart,
          `other: ($) => alias($.${prefix}, $.prefix),\n  ${prefixStart}`,
        ),
      ),
      test(
        "rule map contains a spread",
        before.replace(prefixStart, `...rules,\n  ${prefixStart}`),
      ),
      test(
        "prefix definition is duplicated",
        before.replace(prefixStart, `"${prefix}": ($) => $.other,\n  ${prefixStart}`),
      ),
      ...["alias", "token", "prec.dynamic"].map((wrapper) =>
        test(
          `unsafe enclosing ${wrapper} scope`,
          before
            .replace(prefixStart, prefixStart.replace("seq(", `${wrapper}(seq(`))
            .replace(
              `${handler},\n  ),`,
              `${handler},\n  )${wrapper === "alias" ? ", $.prefix" : ""}),`,
            )
            .replace("prec.dynamic(seq(", "prec.dynamic(1, seq("),
        ),
      ),
      ...[`${prefix}:`, event, choice, anywhere, handler, "__subscribe_in_phrase:"].map((part) =>
        test(
          `rule disabled at ${part}`,
          before.replace(part, `\n// oxlint-disable-next-line rule-to-test/${name}\n${part}`),
        ),
      ),
    ],
    invalid: [
      { ...test("SUBSCRIBE publisher selector in a precedence-owned prefix"), errors: [warning] },
      {
        ...test(
          "keyword first with static options",
          before.replace(
            choice,
            `choice(alias(kw("ANYWHERE", { offset: 4 }), $.anywhere), ${inPhrase})`,
          ),
        ),
        errors: [warning],
      },
    ],
  });

  for (const metadata of ["inline", "conflicts"]) {
    const symbols = metadata === "conflicts" ? `[$.${prefix}]` : `$.${prefix}`;
    writeFileSync(rootPath, `export default grammar({ ${metadata}: ($) => [${symbols}] });`);
    new RuleTester().run(name, requiredClauseSelectorExtraction, {
      valid: [test(`prefix occurs in ${metadata}`)],
      invalid: [],
    });
  }
} finally {
  rmSync(directory, { recursive: true, force: true });
}
