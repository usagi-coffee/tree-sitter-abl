import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { recursiveTailReuse } from "../oxlint/rules/recursive-tail-reuse.js";

const rules = `
  circuit: ($) => choice($.contact, alias($._linked, $.chain)),
  _linked: ($) => prec.right("joining", seq($.contact, $._connection)),
  _connection: ($) => prec.right("joining", seq("~", $.contact, optional($._connection))),
  contact: ($) => "socket",
`;
const grammar = (ruleMap = rules, metadata = 'precedences: ($) => [["joining"]],') =>
  `export default grammar({ name: "circuit", ${metadata} rules: { ${ruleMap} } });`;
const module = (ruleMap = rules) => `export default () => ({ ${ruleMap} });`;
const directory = mkdtempSync(join(tmpdir(), "tree-sitter-recursive-tail-"));
const rootFile = join(directory, "grammar.js");
const modulePath = join(directory, "grammar", "parts");
const moduleFile = join(modulePath, "circuit.js");
const testCase = (name, code, filename = rootFile) => ({ name, code, filename, cwd: directory });
const errors = [{ message: /_connection consumes the separator, the same item as _linked/ }];
const renamed = rules
  .replaceAll("circuit", "pipeline")
  .replaceAll("contact", "stage")
  .replaceAll("_linked", "_sequence")
  .replaceAll("_connection", "_segment")
  .replaceAll("chain", "pipe_list")
  .replaceAll('"joining", ', "")
  .replace('"~"', '"|"');

try {
  new RuleTester().run("recursive-tail-reuse", recursiveTailReuse, {
    valid: [
      testCase(
        "already folded",
        grammar(
          rules.replace(
            /seq\(\$\.contact, \$\._connection\)\),\n.*_connection:.*\n/,
            'seq($.contact, "~", choice($._linked, $.contact))),\n',
          ),
        ),
      ),
      testCase("different item", grammar(rules.replace('"~", $.contact', '"~", $.pin'))),
      testCase(
        "different precedence",
        grammar(rules.replace('"joining", seq("~"', '"other", seq("~"')),
      ),
      testCase(
        "left-associative tail",
        grammar(rules.replace("_connection: ($) => prec.right", "_connection: ($) => prec.left")),
      ),
      testCase("no required separator", grammar(rules.replace('"~", ', ""))),
      testCase("grouped separator", grammar(rules.replace('"~", ', 'optional("~"), '))),
      testCase("additional tail use", grammar(`${rules} spare: ($) => $._connection,`)),
      testCase("additional head use", grammar(`${rules} spare: ($) => $._linked,`)),
      testCase("tail is in metadata", grammar(rules, "inline: ($) => [$._connection],")),
      testCase("head is in metadata", grammar(rules, "conflicts: ($) => [[$._linked]],")),
      testCase("computed metadata access", grammar(rules, 'inline: ($) => [$["_connection"]],')),
      testCase("unaliased head", grammar(rules.replace("alias($._linked, $.chain)", "$._linked"))),
      testCase(
        "alias does not extend same item",
        grammar(rules.replace("choice($.contact", "choice($.pin")),
      ),
      testCase("duplicate head definition", grammar(`${rules} _linked: ($) => $.contact,`)),
      testCase("an unknown rule map overrides declarations", grammar(`${rules} ...otherRules,`)),
      testCase("non-grammar object", `const namespace = { ${rules} };`),
      testCase(
        "tail suppression",
        grammar(
          rules.replace(
            "  _connection:",
            "  // oxlint-disable-next-line rule-to-test/recursive-tail-reuse\n  _connection:",
          ),
        ),
      ),
    ],
    invalid: [{ ...testCase("standalone circuit grammar", grammar()), errors }],
  });

  mkdirSync(modulePath, { recursive: true });
  const root = `import parts from "./grammar/parts/circuit.js";
export default grammar({ name: "circuit", rules: { ...parts() } });`;
  writeFileSync(rootFile, root);
  new RuleTester().run("recursive-tail-reuse modular grammar", recursiveTailReuse, {
    valid: [],
    invalid: [
      { ...testCase("modular circuit grammar", module(), moduleFile), errors },
      {
        ...testCase("unrelated grammar structure and names", module(renamed), moduleFile),
        errors: [{ message: /_segment consumes the separator, the same item as _sequence/ }],
      },
    ],
  });

  writeFileSync(rootFile, root.replace("name:", 'conflicts: ($) => [[$["_linked"]]], name:'));
  new RuleTester().run("recursive-tail-reuse project references", recursiveTailReuse, {
    valid: [testCase("the grammar root references the hidden head", module(), moduleFile)],
    invalid: [],
  });

  writeFileSync(rootFile, root);
  writeFileSync(
    join(modulePath, "other.js"),
    "export default () => ({ node: ($) => $._connection });",
  );
  new RuleTester().run("recursive-tail-reuse cross-module use", recursiveTailReuse, {
    valid: [testCase("another module references the hidden tail", module(), moduleFile)],
    invalid: [],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
