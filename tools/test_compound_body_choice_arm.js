import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { singleUseAliasSequence } from "../oxlint/index.js";

const opener = 'alias($._colon, ":")';
const statements = "$._compound_body";
const closing = "optional(choice($._kw_get, $._kw_set))";
const body = `seq(
    ${opener},
    ${statements},
  )`;
const use = `seq($.__accessor_body, ${closing}, $._terminator)`;
const alternatives = `choice(
    $._terminator_dot,
    ${use},
  )`;
const definition = `__accessor_body: ($) => ${body},`;
const before = `export default grammar({ rules: {
  __accessor_tail: ($) => ${alternatives},
  ${definition}
} });`;
const suppression = "// oxlint-disable-next-line rule-to-test/single-use-alias-sequence";
const message =
  /starts one unaliased choice-arm sequence.*aliased colon and compound statement list.*retaining the closing keywords, terminator and choice order/;
const directory = mkdtempSync(join(tmpdir(), "abl-compound-body-choice-arm-"));
const fixture = (name, code = before) => ({
  name,
  code,
  cwd: directory,
  filename: join(directory, "grammar", "statements", "accessors.js"),
});

try {
  mkdirSync(join(directory, "grammar", "precedences"), { recursive: true });
  writeFileSync(
    join(directory, "grammar.js"),
    `export default grammar({
      inline: ($) => [$.__inline_body],
      conflicts: ($) => [[$.__conflict_tail]],
    });`,
  );
  writeFileSync(
    join(directory, "grammar", "precedences", "accessors.js"),
    "export default ($) => [[$.__precedence_body, $.other]];",
  );

  new RuleTester().run("single-use-alias-sequence", singleUseAliasSequence, {
    valid: [
      fixture(
        "inlined accessor branch",
        before
          .replace(use, `seq(${opener}, ${statements}, ${closing}, $._terminator)`)
          .replace(definition, ""),
      ),
      fixture("non-colon alias", before.replace(opener, 'alias($._colon, ".")')),
      fixture("optional colon", before.replace(opener, `optional(${opener})`)),
      fixture("unaliased colon", before.replace(opener, "$._colon")),
      fixture("alias onto a named tree node", before.replace(opener, "alias($._colon, $.colon)")),
      fixture("different body", before.replace(statements, "$._statements")),
      fixture(
        "body is not the first element",
        before.replace(use, `seq(${closing}, $.__accessor_body, $._terminator)`),
      ),
      fixture("unwrapped sequence", before.replace(alternatives, use)),
      fixture(
        "precedence around choice",
        before.replace(alternatives, `prec.right(${alternatives})`),
      ),
      fixture("aliased sequence", before.replace(use, `alias(${use}, $.body)`)),
      fixture("field around sequence", before.replace(use, `field("tail", ${use})`)),
      fixture("different sibling alternative", before.replace("$._terminator_dot", "$.other")),
      fixture("required closing keywords", before.replace(closing, "choice($._kw_get, $._kw_set)")),
      fixture(
        "arbitrary closing expression",
        before.replace(closing, "optional(choice($._expression, $._kw_set))"),
      ),
      fixture("different terminator", before.replace("$._terminator)", "$._terminator_dot)")),
      fixture("non-private owner", before.replaceAll("__accessor_tail", "accessor_tail")),
      fixture("repeated use", before.replace(use, `${use}, ${use}`)),
      fixture(
        "computed use",
        before.replace(use, use.replace("$.__accessor_body", '$["__accessor_body"]')),
      ),
      fixture("dynamic use elsewhere", `${before}\nconst use = ($) => $[name];`),
      fixture("computed second use", `${before}\nconst use = ($) => $["__accessor_body"];`),
      fixture("spread into rule map", before.replace("rules: {", "rules: { ...otherRules,")),
      fixture(
        "indirect recursion",
        before.replace(definition, `${definition}\n  _compound_body: ($) => $.__accessor_tail,`),
      ),
      fixture(
        "dynamic local dependency",
        before.replace(definition, `${definition}\n  _compound_body: ($) => makeRule($),`),
      ),
      fixture("inline metadata", before.replaceAll("__accessor_body", "__inline_body")),
      fixture("conflict metadata", before.replaceAll("__accessor_tail", "__conflict_tail")),
      fixture("precedence metadata", before.replaceAll("__accessor_body", "__precedence_body")),
      fixture(
        "definition suppression",
        before.replace(definition, `${suppression}\n  ${definition}`),
      ),
      fixture("choice arm suppression", before.replace(use, `${suppression}\n    ${use}`)),
      fixture("alias suppression", before.replace(opener, `${suppression}\n    ${opener}`)),
    ],
    invalid: [
      {
        ...fixture("colon and compound body before accessor closing keywords"),
        errors: [{ message }],
      },
      {
        ...fixture(
          "same structural shape in another private tail",
          before
            .replaceAll("__accessor_tail", "__block_end")
            .replaceAll("__accessor_body", "__block_body")
            .replace("$._kw_get, $._kw_set", "$._kw_method, $._kw_constructor"),
        ),
        errors: [{ message }],
      },
    ],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
