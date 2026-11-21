import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { singleUseListChoiceArm } from "../oxlint/rules/single-use-list-choice-arm.js";

const rules = (choice = "choice($._compact, $._expanded)", branch = "$._guard") => `
  document: ($) => seq("emit", $._parameters, ";"),
  _parameters: ($) => ${choice},
  _compact: ($) => seq("#", field("value", $.word)),
  _expanded: ($) =>
    seq($._names, optional(alias($._fence, $.fence)), optional(${branch})),
  _names: ($) => prec.right(seq(alias($._name, $.name), optional($._names))),
  _name: ($) => $.word,
  _fence: ($) => seq("with", $.word),
  _guard: ($) => seq("when", $.number),
  number: () => /[0-9]+/,
  word: () => /[a-z]+/,
`;
const standalone = (ruleMap = rules(), metadata = "") =>
  `export default grammar({ name: "sample", ${metadata} rules: { ${ruleMap} } });`;
const modular = `export default () => ({
  directive: ($) => seq("send", $.__mode, ";"),
  __mode: ($) => choice($.__detailed, $.simple),
  __detailed: ($) =>
    seq($.__items, optional(alias($._mark, $.marker)), optional($.size), optional($.note)),
  __items: ($) => prec.right("items", seq(alias($.__item, $.entry), optional($.__items))),
  __item: ($) => /[a-z]+/,
  _mark: ($) => "@",
  size: ($) => seq("size", /[0-9]+/),
  note: ($) => seq("note", /[a-z]+/),
  simple: ($) => "*",
});`;
const suggestion = { message: /_expanded has one direct choice-arm use in _parameters/ };
const directory = mkdtempSync(join(tmpdir(), "single-use-list-choice-arm-"));
const root = join(directory, "grammar.js");
const modules = join(directory, "grammar");
const other = join(modules, "commands.js");
const test = (label, valid, invalid = []) =>
  new RuleTester().run(label, singleUseListChoiceArm, { valid, invalid });
const fixture = (name, code, filename = root) => ({ name, code, filename, cwd: directory });

try {
  mkdirSync(modules);
  test(
    "single-use-list-choice-arm",
    [
      fixture(
        "inlined sequence",
        standalone(
          rules(
            "choice($._compact, seq($._names, optional(alias($._fence, $.fence)), optional($._guard)))",
          ).replace(/\n  _expanded:[\s\S]+?(?=\n  _names:)/, ""),
        ),
      ),
      fixture("additional use", standalone(rules() + " other: ($) => $._expanded,")),
      fixture("computed use", standalone(rules() + ' other: ($) => $["_expanded"],')),
      fixture("dynamic use", standalone(rules() + " other: ($) => $[variant],")),
      fixture(
        "aliased choice arm",
        standalone(rules("choice($._compact, alias($._expanded, $.arguments))")),
      ),
      fixture("wrapped choice", standalone(rules("prec.right(choice($._compact, $._expanded))"))),
      fixture("third choice arm", standalone(rules("choice($._compact, $._expanded, $.word)"))),
      fixture(
        "list recurs on the left",
        standalone(
          rules().replace(
            "seq(alias($._name, $.name), optional($._names))",
            "seq(optional($._names), alias($._name, $.name))",
          ),
        ),
      ),
      fixture(
        "optional alias is absent",
        standalone(rules().replace("optional(alias($._fence, $.fence)), ", "")),
      ),
      fixture("optional suffix is compound", standalone(rules(undefined, 'seq("when", $.number)'))),
      fixture("metadata on the arm", standalone(undefined, "inline: ($) => [$._expanded],")),
      fixture(
        "metadata on the choice",
        standalone(undefined, "conflicts: ($) => [[$._parameters]],"),
      ),
      fixture("spread can override the arm", standalone(rules() + " ...moreRules,")),
      fixture("duplicate arm", standalone(rules() + ' _expanded: ($) => "?",')),
      fixture(
        "rule is suppressed",
        standalone(
          rules().replace(
            "  _expanded:",
            "  // oxlint-disable-next-line rule-to-test/single-use-list-choice-arm\n  _expanded:",
          ),
        ),
      ),
    ],
    [
      { ...fixture("standalone grammar", standalone()), errors: [suggestion] },
      {
        ...fixture("renamed module with first choice arm and two suffixes", modular, other),
        errors: [{ message: /__detailed has one direct choice-arm use in __mode/ }],
      },
    ],
  );

  writeFileSync(other, "export default { nested: ($) => $._expanded };");
  test("single-use-list-choice-arm", [
    fixture("arm referenced by another grammar source", standalone()),
  ]);

  rmSync(other);
  writeFileSync(root, 'export default grammar({ conflicts: ($) => [[$["__mode"]]] });');
  test("single-use-list-choice-arm", [
    fixture("choice is referenced by root metadata", modular, other),
  ]);
} finally {
  rmSync(directory, { recursive: true, force: true });
}
