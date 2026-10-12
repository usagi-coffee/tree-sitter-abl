import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { noNumericPrecedence, hoistRulePrecedence } from "../oxlint/index.js";

const directory = mkdtempSync(join(tmpdir(), "abl-precedence-lint-"));
const fixture = (code) => ({ code, cwd: directory, filename: join(directory, "grammar.js") });
const grammar = (body) => `export default grammar({rules: {${body}}});`;
const helper = (
  expression = 'prec.right(seq("IN", $.identifier))',
  parent = 'seq("USE", $.__clause)',
) => grammar(`parent: ($) => ${parent}, __clause: ($) => ${expression}`);
try {
  new RuleTester().run("no-numeric-precedence", noNumericPrecedence, {
    valid: [
      ...[
        'prec("clause", $.identifier)',
        'prec.left("clause", $.identifier)',
        "prec.right($.identifier)",
        "prec.dynamic(2, $.identifier)",
      ].map((body) => fixture(grammar(`item: ($) => ${body}`))),
      fixture('const value = prec(2, "outside grammar");'),
      fixture(
        grammar(
          "// oxlint-disable-next-line rule-to-test/no-numeric-precedence\nitem: ($) => prec(1, $.identifier)",
        ),
      ),
    ],
    invalid: [
      ...[
        "prec(1, $.identifier)",
        "prec.left(0, $.identifier)",
        "prec.right(-2, $.identifier)",
        "prec(+3, $.identifier)",
        "prec.right(1 + 2, $.identifier)",
        'seq("A", prec.left(0.5, $.identifier))',
      ].map((body) => ({
        ...fixture(grammar(`item: ($) => ${body}`)),
        errors: [{ message: /named precedence.*grammar\/precedences/ }],
      })),
      ...["token(prec(1, /foo/))", "token.immediate(prec(-1, /foo/))"].map((body) => ({
        ...fixture(grammar(`item: ($) => ${body}`)),
        errors: [{ message: /lexical.*cannot replace token priority/ }],
      })),
    ],
  });
  new RuleTester().run("hoist-rule-precedence", hoistRulePrecedence, {
    valid: [
      fixture(helper('prec.right("clause", seq("IN", $.identifier))')),
      fixture(helper('prec.right(2, seq("IN", $.identifier))')),
      fixture(helper("prec.dynamic(1, $.identifier)")),
      fixture(helper('seq("IN", prec.right($.identifier))')),
      fixture(helper('prec.right(token("IN"))')),
      fixture(helper("prec.right(prec.left($.identifier))")),
      fixture(helper('prec.right(seq("IN", optional($.__clause)))')),
      fixture(
        grammar(
          "parent: ($) => $.__clause, __clause: ($) => prec.right($.__tail), __tail: ($) => $.__clause",
        ),
      ),
      ...[
        "alias($.__clause, $.clause)",
        'field("clause", $.__clause)',
        "token($.__clause)",
        "prec.right($.__clause)",
      ].map((parent) => fixture(helper(undefined, parent))),
      fixture(helper().replaceAll("__clause", "visible_clause")),
      fixture(helper().replace('parent: ($) => seq("USE", $.__clause), ', "")),
      fixture(helper().replace("rules: {", "inline: ($) => [$.__clause], rules: {")),
      fixture(helper().replace("rules: {", "conflicts: ($) => [[$.__clause, $.other]], rules: {")),
      fixture(
        helper().replace("rules: {", "precedences: ($) => [[$.__clause, $.other]], rules: {"),
      ),
      fixture(helper(undefined, 'seq($["unknown"], $.__clause)')),
      fixture(
        helper().replace(
          "__clause: ($)",
          "// oxlint-disable-next-line rule-to-test/hoist-rule-precedence\n__clause: ($)",
        ),
      ),
      fixture(
        helper().replace(
          "parent: ($)",
          "// oxlint-disable-next-line rule-to-test/hoist-rule-precedence\nparent: ($)",
        ),
      ),
    ],
    invalid: [
      ...["prec", "prec.left", "prec.right"].map((operator) => ({
        ...fixture(helper(`${operator}(seq("IN", $.identifier))`)),
        errors: [
          {
            message:
              /parent rule\(s\) parent.*"named precedence".*grammar\/precedences.*reduction scope/,
          },
        ],
      })),
      { ...fixture(helper('prec.right(seq("IN", field("name", $.identifier)))')), errors: 1 },
      {
        ...fixture(helper().replace("parent: ($)", "second: ($) => $.__clause, parent: ($)")),
        errors: [{ message: /second, parent/ }],
      },
      {
        ...fixture(
          'export default ({ kw }) => ({parent: ($) => $.__clause, __clause: ($) => prec.left(seq(kw("IN"), $.identifier))});',
        ),
        errors: 1,
      },
      {
        ...fixture(
          helper().replace(
            "__clause: ($)",
            "// oxlint-disable-next-line rule-to-test/single-use-precedence\n__clause: ($)",
          ),
        ),
        errors: 1,
      },
    ],
  });
  mkdirSync(join(directory, "grammar", "precedences"), { recursive: true });
  for (const metadata of [
    "inline",
    "conflicts",
    "precedences",
    "supertypes",
    "externals",
    "extras",
    "word",
  ]) {
    writeFileSync(
      join(directory, "grammar.js"),
      `export default grammar({${metadata}: ($) => [$.__clause], rules: {}});`,
    );
    new RuleTester().run(`hoist external ${metadata}`, hoistRulePrecedence, {
      valid: [{ ...fixture(helper()), filename: join(directory, "clause.js") }],
      invalid: [],
    });
  }
  writeFileSync(join(directory, "grammar.js"), "export default grammar({rules: {}});");
  writeFileSync(
    join(directory, "grammar", "precedences", "clause.js"),
    "export default ($) => [[$.__clause, $.other]];",
  );
  new RuleTester().run("hoist external precedence group", hoistRulePrecedence, {
    valid: [fixture(helper())],
    invalid: [],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
