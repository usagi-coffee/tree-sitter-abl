import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { recursiveListFrameSuffix } from "../oxlint/index.js";

const ruleId = "recursive-list-frame-suffix";
const owner = "__color_tail";
const list = "__color_targets";
const frame = "optional($.frame_phrase)";
const ownerUse = `$.${owner}`;
const listUse = `$.${list}`;
const continuation = `optional(${listUse})`;
const items = "choice($._qualified_identifier, $.scoped_name, $.input_expression)";
const before = `export default ({ kw }) => ({
  color_statement: ($) => seq($.__color_prefix, $._terminator),
  __color_prefix: ($) =>
    seq($._kw_color, optional(seq(optional(alias($._kw_display, $.display)), ${ownerUse}))),
  ${owner}: ($) => seq(
    field("color", $.color_phrase),
    optional(seq($._kw_prompt, field("prompt_color", $.color_phrase))),
    ${listUse},
    ${frame},
  ),
  ${list}: ($) => prec.right(seq(${items}, ${continuation})),
});`;
const after = before
  .replace(`    ${frame},\n`, "")
  .replace(continuation, `optional(choice(${listUse}, $.frame_phrase))`);
const addRule = (rule) => before.replace("\n});", `\n  ${rule},\n});`);

const directory = mkdtempSync(join(tmpdir(), "abl-recursive-list-frame-suffix-"));
const rootPath = join(directory, "grammar.js");
const statementDirectory = join(directory, "grammar", "statements");
const fixture = (name, code = before) => ({
  name,
  code,
  cwd: directory,
  filename: join(statementDirectory, "color.js"),
});
const warning = {
  message: /optional FRAME phrase in __color_tail into the terminal branch of __color_targets/,
};

try {
  mkdirSync(statementDirectory, { recursive: true });
  writeFileSync(
    rootPath,
    "export default grammar({precedences: ($) => [[$.frame_phrase, $.other]]});",
  );
  new RuleTester().run(ruleId, recursiveListFrameSuffix, {
    valid: [
      fixture("FRAME already terminates the list", after),
      fixture("required FRAME", before.replace(frame, "$.frame_phrase")),
      fixture("aliased FRAME", before.replace(frame, "optional(alias($.frame_phrase, $.frame))")),
      fixture("FRAME field", before.replace(frame, 'field("frame", optional($.frame_phrase))')),
      fixture("element after FRAME", before.replace(frame, `${frame}, $.other`)),
      fixture("earlier FRAME", before.replace(listUse, `${frame}, ${listUse}`)),
      fixture("locally defined FRAME", addRule('frame_phrase: ($) => kw("WITH")')),
      fixture("optional list", before.replace(listUse, continuation)),
      fixture("aliased list", before.replace(listUse, `alias(${listUse}, $.targets)`)),
      fixture("undefined local list", before.replace(listUse, "$.__other_targets")),
      fixture("aliased owner", before.replace(ownerUse, `alias(${ownerUse}, $.color_tail)`)),
      fixture(
        "recursive owner",
        before.replace('field("color", $.color_phrase)', "$.__color_prefix"),
      ),
      fixture(
        "indirectly recursive owner",
        addRule("__color_head: ($) => $.__color_prefix").replace(
          'field("color", $.color_phrase)',
          "$.__color_head",
        ),
      ),
      fixture("left precedence", before.replace("prec.right", "prec.left")),
      fixture(
        "named right precedence",
        before.replace("prec.right(seq", 'prec.right("items", seq'),
      ),
      fixture("single item", before.replace(items, "$._qualified_identifier")),
      fixture("nullable item branch", before.replace("$.scoped_name", "optional($.scoped_name)")),
      fixture("nullable local item definition", addRule("scoped_name: ($) => optional($.other)")),
      fixture("aliased item", before.replace("$.scoped_name", "alias($.scoped_name, $.target)")),
      fixture("FRAME as an item", before.replace("$.scoped_name", "$.frame_phrase")),
      fixture("other continuation", before.replace(continuation, "optional($.__other_targets)")),
      fixture("required continuation", before.replace(continuation, listUse)),
      fixture(
        "alternative continuation",
        before.replace(continuation, `optional(choice(${listUse}, $.other))`),
      ),
      fixture("extra list element", before.replace(continuation, `${continuation}, $.other`)),
      fixture("additional reference to the list", addRule(`other: ($) => ${listUse}`)),
      fixture("additional reference to the owner", addRule(`other: ($) => ${ownerUse}`)),
      fixture("duplicate list rule", addRule(`${list}: ($) => $.other`)),
      fixture("computed reference", before.replace(listUse, `$["${list}"]`)),
      fixture("dynamic reference outside the rule map", `${before}\nconst other = ($) => $[name];`),
      fixture("spread in the rule map", before.replace(`${owner}:`, `...rules,\n  ${owner}:`)),
      ...[`${owner}:`, `${list}:`, frame].map((part) =>
        fixture(
          `rule disabled at ${part}`,
          before.replace(part, `\n// oxlint-disable-next-line rule-to-test/${ruleId}\n${part}`),
        ),
      ),
    ],
    invalid: [
      { ...fixture("COLOR target list followed by optional FRAME"), errors: [warning] },
      {
        ...fixture(
          "unrelated suppression",
          before.replace(
            frame,
            `// oxlint-disable-next-line rule-to-test/selector-frame-suffix\n${frame}`,
          ),
        ),
        errors: [warning],
      },
    ],
  });

  for (const [key, name] of [
    ["inline", owner],
    ["conflicts", list],
    ["precedences", list],
    ["supertypes", owner],
    ["externals", list],
    ["extras", list],
    ["word", owner],
  ]) {
    const reference = `$.${name}`;
    const nested = ["conflicts", "precedences"].includes(key) ? `[${reference}]` : reference;
    const metadata = key === "word" ? reference : `[${nested}]`;
    writeFileSync(rootPath, `export default grammar({ ${key}: ($) => ${metadata} });`);
    new RuleTester().run(ruleId, recursiveListFrameSuffix, {
      valid: [fixture(`${name} participates in ${key}`)],
      invalid: [],
    });
  }

  writeFileSync(rootPath, "export default grammar({});");
  const precedenceDirectory = join(directory, "grammar", "precedences");
  mkdirSync(precedenceDirectory);
  const precedencePath = join(precedenceDirectory, "color.js");
  writeFileSync(precedencePath, `export default ($) => [[${listUse}, $.other]];`);
  new RuleTester().run(ruleId, recursiveListFrameSuffix, {
    valid: [fixture("the list participates in a separate precedence module")],
    invalid: [],
  });
  rmSync(precedencePath);
  writeFileSync(
    join(statementDirectory, "other.js"),
    `export default () => ({ other: ($) => ${listUse} });`,
  );
  new RuleTester().run(ruleId, recursiveListFrameSuffix, {
    valid: [fixture("the list is referenced in a different module")],
    invalid: [],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
