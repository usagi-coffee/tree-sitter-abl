import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { inlineBranchSeparatorBoundary } from "../oxlint/index.js";

const directory = mkdtempSync(join(tmpdir(), "abl-branch-separator-"));
const sequence =
  'seq($._condition, $._kw_then, field("then", $.__branch), optional(seq($._kw_else, field("else", $.__branch))))';
const before = `export default grammar({
  inline: ($) => [$._kw_else],
  rules: {
    entry: ($) => seq(kw("IF"), prec.right(${sequence})),
    __branch: ($) => choice($._statement, alias($._eof, $.empty_statement)),
    _kw_else: ($) => kw("ELSE"),
  },
});`;
const fixture = readFileSync(new URL("./fixtures/inline-else-branch.js", import.meta.url), "utf8");
const testCase = (name, code = before, cwd = directory, filename = "grammar.js") => ({
  name,
  code,
  cwd,
  filename: join(cwd, filename),
});
const message =
  /expands between required and optional fields of the same branch rule.*removing its inline entry.*existing keyword boundary.*fields, optionality, keyword options, token identities and precedence.*cross-file caller, aliases and metadata.*actions, table bytes, memory, parsing speed.*complete valid and recovery trees/;

try {
  new RuleTester().run("inline-branch-separator-boundary", inlineBranchSeparatorBoundary, {
    valid: [
      testCase("retained separator boundary", before.replace("[$._kw_else]", "[]")),
      testCase(
        "only required-branch marker is inlined",
        before.replace("[$._kw_else]", "[$._kw_then]"),
      ),
      testCase("direct keyword", before.replace("seq($._kw_else, field", 'seq(kw("ELSE"), field')),
      testCase("non-keyword symbol", before.replaceAll("_kw_else", "_alternative")),
      testCase(
        "different branch rule",
        before.replace('field("else", $.__branch)', 'field("else", $.__other)'),
      ),
      testCase("same field", before.replace('field("else",', 'field("then",')),
      testCase("empty field", before.replace('field("else",', 'field("",')),
      testCase("dynamic field", before.replace('field("else",', "field(name,")),
      testCase("public branch", before.replaceAll("__branch", "branch")),
      testCase("shared branch", before.replaceAll("__branch", "_branch")),
      testCase("recursive owner", before.replaceAll("entry", "__branch")),
      testCase("same keyword", before.replaceAll("_kw_then", "_kw_else")),
      testCase("no leading keyword", before.replaceAll("$._kw_then", "$.value")),
      testCase("missing condition", before.replace("$._condition, ", "")),
      testCase(
        "nullable first branch",
        before.replace('field("then", $.__branch)', 'optional(field("then", $.__branch))'),
      ),
      testCase("unfielded first branch", before.replace('field("then", $.__branch)', "$.__branch")),
      testCase(
        "required alternative",
        before.replace(
          'optional(seq($._kw_else, field("else", $.__branch)))',
          'seq($._kw_else, field("else", $.__branch))',
        ),
      ),
      testCase(
        "extra alternative content",
        before.replace("seq($._kw_else, field", 'seq($._kw_else, "EXTRA", field'),
      ),
      testCase("trailing content", before.replace(sequence, `${sequence.slice(0, -1)}, ".")`)),
      testCase("dynamic keyword", before.replace('kw("ELSE")', "kw(keyword)")),
      testCase("dynamic keyword options", before.replace('kw("ELSE")', 'kw("ELSE", options)')),
      testCase(
        "keyword choice",
        before.replace('kw("ELSE")', 'choice(kw("ELSE"), kw("OTHERWISE"))'),
      ),
      ...[
        "alias(BODY, $.branch)",
        'field("branch", BODY)',
        "token(BODY)",
        "token.immediate(BODY)",
        "prec.dynamic(1, BODY)",
        "prec.right(binding, BODY)",
        "custom(BODY)",
      ].map((wrapper) =>
        testCase(
          `unsupported wrapper: ${wrapper}`,
          before.replace(sequence, wrapper.replace("BODY", sequence)),
        ),
      ),
      ...[
        "alias($._kw_else, $.otherwise)",
        'field("separator", $._kw_else)',
        "token($._kw_else)",
        "token.immediate($._kw_else)",
        "prec.dynamic(1, $._kw_else)",
      ].map((use) =>
        testCase(
          `unsafe extra use: ${use}`,
          before.replace("entry:", `other: ($) => ${use}, entry:`),
        ),
      ),
      testCase("computed reference", `${before}\nconst use = ($) => $["_kw_else"];`),
      testCase("dynamic reference", `${before}\nconst use = ($) => $[name];`),
      ...["conflicts", "precedences", "supertypes", "externals", "extras", "word"].map((name) =>
        testCase(
          `${name} metadata`,
          before.replace("rules:", `${name}: ($) => [$._kw_else], rules:`),
        ),
      ),
      ...["entry:", "_kw_else:", sequence, "optional(seq($._kw_else", 'field("then",'].map((part) =>
        testCase(
          `suppression at ${part}`,
          before.replace(
            part,
            `\n// oxlint-disable-next-line rule-to-test/inline-branch-separator-boundary\n${part}`,
          ),
        ),
      ),
      testCase(
        "file suppression",
        `// oxlint-disable rule-to-test/inline-branch-separator-boundary\n${before}`,
      ),
    ],
    invalid: [
      { ...testCase("optional branch separator"), errors: [{ message }] },
      {
        ...testCase(
          "renamed separator and branches",
          before
            .replaceAll("_kw_else", "_kw_otherwise")
            .replaceAll("__branch", "__action")
            .replaceAll('"then"', '"success"')
            .replaceAll('"else"', '"fallback"'),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "keyword options",
          before.replace('kw("ELSE")', 'kw("ELSE", { offset: 3, alias: "ELS" })'),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "named static precedence",
          before.replace("prec.right(", 'prec.right("branch", '),
        ),
        errors: [{ message }],
      },
      {
        ...testCase("direct sequence", before.replace(`prec.right(${sequence})`, sequence)),
        errors: [{ message }],
      },
      {
        ...testCase(
          "other ordinary separator caller",
          before.replace("entry:", "other: ($) => seq($.value, $._kw_else, $.value), entry:"),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "one diagnostic per keyword",
          before.replace("entry:", `other: ($) => ${sequence}, entry:`),
        ),
        errors: [{ message }],
      },
      {
        ...testCase(
          "unrelated suppression",
          before.replace(sequence, `\n// oxlint-disable-next-line unrelated/rule\n${sequence}`),
        ),
        errors: [{ message }],
      },
    ],
  });

  const project = join(directory, "project");
  mkdirSync(join(project, "grammar", "precedences"), { recursive: true });
  writeFileSync(join(project, "grammar.js"), "export default grammar({});");
  writeFileSync(
    join(project, "grammar", "keywords.js"),
    "export const inline = ($) => [$._kw_else];",
  );
  new RuleTester().run("inline-branch-separator-boundary", inlineBranchSeparatorBoundary, {
    valid: [],
    invalid: [
      {
        ...testCase("measured IF branch fixture", fixture, project, "grammar/statements/if.js"),
        errors: [{ message }],
      },
    ],
  });
  writeFileSync(
    join(project, "grammar", "keywords.js"),
    "export const inline = ($) => []; // $._kw_else\n",
  );
  new RuleTester().run("inline-branch-separator-boundary", inlineBranchSeparatorBoundary, {
    valid: [
      testCase("measured retained ELSE boundary", fixture, project, "grammar/statements/if.js"),
    ],
    invalid: [],
  });
  writeFileSync(
    join(project, "grammar", "keywords.js"),
    "export const inline = ($) => [$._kw_else];",
  );
  writeFileSync(
    join(project, "grammar", "precedences", "branch.js"),
    "export default ($) => [[$._kw_else, $.other]];",
  );
  new RuleTester().run("inline-branch-separator-boundary", inlineBranchSeparatorBoundary, {
    valid: [testCase("project precedence", fixture, project, "grammar/statements/if.js")],
    invalid: [],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
