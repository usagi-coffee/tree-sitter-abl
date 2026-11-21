import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { singleUseChoiceSeparator } from "../oxlint/index.js";

const ruleId = "single-use-choice-separator";
const outer = 'seq($._head, ";")';
const tail = 'optional(seq("=>", $._mode))';
const modes = 'choice(seq("read", optional(field("argument", $.word))), $._write)';
const rules = `{
  directive: ($) => ${outer},
  _head: ($) => seq("use", optional(field("target", $.word)), ${tail}),
  _mode: ($) => ${modes},
  _write: () => "write",
  word: () => /[a-z]+/,
}`;
const standalone = `export default grammar({ name: "directives", rules: ${rules} });`;
const modular = `export default () => (${rules});`;
const message = /_mode is a hidden choice with one optional use after "=>" in _head/;
const directory = mkdtempSync(join(tmpdir(), "tree-sitter-choice-separator-"));
const modulePath = join(directory, "parts", "commands", "directives.js");
const fixture = (name, code = standalone, filename = join(directory, "grammar.js")) => ({
  name,
  code,
  cwd: directory,
  filename,
});

try {
  mkdirSync(join(directory, "parts", "commands"), { recursive: true });
  writeFileSync(
    join(directory, "grammar.js"),
    `import directives from "./parts/commands/directives.js";
     export default grammar({ rules: { ...directives() }, inline: ($) => [$._inlined_mode] });`,
  );
  writeFileSync(
    join(directory, "parts", "labels.mjs"),
    `export default () => ({ label: ($) => $["_shared_mode"], target: ($) => $._shared_head });`,
  );
  new RuleTester().run(ruleId, singleUseChoiceSeparator, {
    valid: [
      fixture(
        "separator already inside the helper",
        standalone.replace(tail, "optional($._mode)").replace(modes, `seq("=>", ${modes})`),
      ),
      fixture("named choice", standalone.replaceAll("_mode", "mode")),
      fixture("named head", standalone.replaceAll("_head", "head")),
      fixture("required choice", standalone.replace(tail, 'seq("=>", $._mode)')),
      fixture("nonfinal choice", standalone.replace(tail, `${tail}, ":"`)),
      fixture("word separator", standalone.replace('"=>"', '"then"')),
      fixture("aliased choice use", standalone.replace("$._mode", "alias($._mode, $.mode)")),
      fixture("choice reused in owner suffix", standalone.replace(outer, "seq($._head, $._mode)")),
      fixture(
        "choice reused in metadata",
        standalone.replace('name: "directives",', 'inline: ($) => [$["_mode"]],'),
      ),
      fixture("head reused", standalone.replace(outer, 'seq($._head, $._head, ";")')),
      fixture("outer use aliased", standalone.replace("$._head", "alias($._head, $.head)")),
      fixture("dynamic rule reference", `${standalone}\nconst other = ($) => $[key];`),
      fixture("opaque rule object use", `${standalone}\nconst other = ($) => makeRule($);`),
      fixture("dynamic rule map", standalone.replace("  directive:", "  ...other,\n  directive:")),
      fixture(
        "duplicate rule name",
        standalone.replace("  _mode:", "  _mode: () => 'other',\n  _mode:"),
      ),
      fixture("direct recursion", standalone.replace("$._write)", "$._mode)")),
      fixture(
        "indirect recursion through head",
        standalone.replace('_write: () => "write"', "_write: ($) => $._head"),
      ),
      fixture(
        "indirect recursion through owner",
        standalone.replace('_write: () => "write"', "_write: ($) => $.directive"),
      ),
      fixture(
        "dynamic precedence in choice",
        standalone.replace("$._write)", "prec.dynamic(1, $._write))"),
      ),
      fixture(
        "suppressed suggestion",
        standalone.replace(
          "  _mode:",
          `  // oxlint-disable-next-line rule-to-test/${ruleId}\n  _mode:`,
        ),
      ),
      fixture("external metadata", modular.replaceAll("_mode", "_inlined_mode"), modulePath),
      fixture("sibling module choice use", modular.replaceAll("_mode", "_shared_mode"), modulePath),
      fixture("sibling module head use", modular.replaceAll("_head", "_shared_head"), modulePath),
    ],
    invalid: [
      { ...fixture("standalone grammar with lexical callbacks"), errors: [{ message }] },
      {
        ...fixture("modular factory under an unrelated directory", modular, modulePath),
        errors: [{ message }],
      },
    ],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
