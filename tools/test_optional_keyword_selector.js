import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { singleUseChoice } from "../oxlint/index.js";

const prefix = "seq($._kw_return, optional($.__return_body))";
const selector = `choice(
    field("value", $._expression),
    $.__return_error_clause,
    alias($._kw_no_apply, $.no_apply),
  )`;
const definition = `__return_body: ($) => ${selector},`;
const before = `export default grammar({ rules: {
  return_statement: ($) => seq($.__return_prefix, $._terminator),
  __return_prefix: ($) => ${prefix},
  ${definition}
} });`;
const suppression = "// oxlint-disable-next-line rule-to-test/single-use-choice";
const message =
  /sole optional selector in the private keyword prefix __return_prefix.*retaining the prefix/;
const directory = mkdtempSync(join(tmpdir(), "abl-optional-keyword-selector-"));
const fixture = (name, code = before) => ({
  name,
  code,
  cwd: directory,
  filename: join(directory, "grammar.js"),
});

try {
  mkdirSync(join(directory, "grammar", "precedences"), { recursive: true });
  const precedence = (name) => `export default ($) => [[$.${name}, $.other]];`;
  writeFileSync(
    join(directory, "grammar", "precedences", "selector.js"),
    precedence("__other_body"),
  );
  writeFileSync(
    join(directory, "grammar.js"),
    "export default grammar({ inline: ($) => [$.__another_prefix] });",
  );
  new RuleTester().run("single-use-choice", singleUseChoice, {
    valid: [
      fixture(
        "inlined RETURN selector",
        before.replace("$.__return_body", selector).replace(definition, ""),
      ),
      ...[
        "seq($._kw_return, $.__return_body)",
        "seq($._kw_return, optional($.__return_body), $.tail)",
        "seq(optional($.__return_body), $._kw_return)",
        "seq($.marker, optional($.__return_body))",
        "seq(kw(keyword), optional($.__return_body))",
        "seq($._kw_return, optional(alias($.__return_body, $.value)))",
        'seq($._kw_return, optional(field("outer", $.__return_body)))',
        "seq($._kw_return, token($.__return_body))",
        "seq($._kw_return, optional($.__return_body), optional($.__return_body))",
        "seq($._kw_return, optional($[name]))",
        `prec.right(${prefix})`,
      ].map((shape) => fixture(`unsupported prefix ${shape}`, before.replace(prefix, shape))),
      fixture("public prefix", before.replaceAll("__return_prefix", "return_prefix")),
      fixture(
        "private non-prefix caller",
        before.replaceAll("__return_prefix", "__return_options"),
      ),
      fixture("missing alternative", before.replace("    $.__return_error_clause,\n", "")),
      fixture("non-field value", before.replace('field("value", $._expression)', "$._expression")),
      fixture("empty field name", before.replace('field("value",', 'field("",')),
      fixture("dynamic field value", before.replace("$._expression", "$[symbol]")),
      fixture("non-private clause", before.replace("$.__return_error_clause", "$.clause")),
      fixture("hidden flag destination", before.replace("$.no_apply", "$._no_apply")),
      fixture("non-keyword flag source", before.replace("$._kw_no_apply", "$.flag")),
      fixture("dynamic flag keyword", before.replace("$._kw_no_apply", "kw(flag)")),
      fixture("dynamic use elsewhere", `${before}\nconst use = ($) => $[name];`),
      fixture("computed use elsewhere", `${before}\nconst use = ($) => $["__return_body"];`),
      fixture("rule-map spread", before.replace("rules: {", "rules: { ...rules,")),
      fixture("direct recursion", before.replace("$.__return_error_clause", "$.__return_body")),
      fixture(
        "recursion through caller",
        before.replace("$.__return_error_clause", "$.__return_prefix"),
      ),
      fixture(
        "local indirect recursion",
        before.replace(
          definition,
          `${definition}\n  __return_error_clause: ($) => $.__return_prefix,`,
        ),
      ),
      fixture(
        "dynamic local dependency",
        before.replace(definition, `${definition}\n  __return_error_clause: ($) => makeRule($),`),
      ),
      ...["inline", "conflicts", "precedences", "supertypes", "externals", "extras", "word"].map(
        (key) =>
          fixture(
            `metadata ${key}`,
            before.replace("rules:", `${key}: ($) => [$.__return_prefix], rules:`),
          ),
      ),
      {
        ...fixture(
          "root inline metadata on retained prefix",
          before.replaceAll("__return_prefix", "__another_prefix"),
        ),
        filename: join(directory, "return.js"),
      },
      {
        ...fixture(
          "separate precedence module references selector",
          before.replaceAll("__return_body", "__other_body"),
        ),
        filename: join(directory, "return.js"),
      },
      fixture("suppressed selector", before.replace(definition, `${suppression}\n  ${definition}`)),
      fixture(
        "suppressed prefix",
        before.replace("  __return_prefix:", `  ${suppression}\n  __return_prefix:`),
      ),
      fixture(
        "suppressed option",
        before.replace(
          "    $.__return_error_clause,",
          `    ${suppression}\n    $.__return_error_clause,`,
        ),
      ),
      fixture(
        "suppressed use",
        before.replace(
          "optional($.__return_body)",
          `\n    ${suppression}\n    optional($.__return_body)`,
        ),
      ),
    ],
    invalid: [
      { ...fixture("RETURN optional selector"), errors: [{ message }] },
      {
        ...fixture(
          "RETURN prefix suppressed for other rules",
          before.replace(
            "  __return_prefix:",
            "  // oxlint-disable-next-line rule-to-test/single-use-keyword-sequence, rule-to-test/single-use-sequence\n  __return_prefix:",
          ),
        ),
        errors: [{ message }],
      },
      {
        ...fixture(
          "literal keyword calls",
          before
            .replace("$._kw_return", 'kw("RETURN", { offset: 3 })')
            .replace("$._kw_no_apply", 'kw("NO-APPLY")'),
        ),
        errors: [{ message }],
      },
    ],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
