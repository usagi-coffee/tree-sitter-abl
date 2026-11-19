import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { literalOpenerBodyBoundary } from "../oxlint/index.js";

const use = "$.__annotation_body";
const caller = `seq("@", ${use}, $._terminator)`;
const name = 'field("name", alias($.__annotation_name, $.identifier))';
const clause = 'optional(seq("(", optional(alias($.__annotation_attributes, $.attributes)), ")"))';
const body = `seq(${name}, ${clause})`;
const definition = `__annotation_body: ($) => ${body},`;
const attributes = 'seq($.attribute, optional(seq(",", $.__annotation_attributes)))';
const before = `export default () => ({
  annotation: ($) => ${caller},
  ${definition}
  __annotation_name: () => token(/[_A-Za-z]+/),
  __annotation_attributes: ($) => ${attributes},
});`;
const suppression = "// oxlint-disable-next-line rule-to-test/literal-opener-body-boundary";
const message =
  /literal opener before the sole use.*moving that opener into the retained private body/;
const directory = mkdtempSync(join(tmpdir(), "abl-literal-opener-body-"));
const fixture = (name, code = before) => ({
  name,
  code,
  cwd: directory,
  filename: join(directory, "grammar", "statements", "annotation.js"),
});

try {
  mkdirSync(join(directory, "grammar", "precedences"), { recursive: true });
  mkdirSync(join(directory, "grammar", "statements"), { recursive: true });
  writeFileSync(
    join(directory, "grammar.js"),
    "export default grammar({ inline: ($) => [$.__inline_body] });",
  );
  writeFileSync(
    join(directory, "grammar", "precedences", "annotation.js"),
    "export default ($) => [[$.restricted_annotation, $.other]];",
  );
  writeFileSync(
    join(directory, "grammar", "statements", "consumer.js"),
    'export default () => ({ consumer: ($) => $["__external_body"] });',
  );

  new RuleTester().run("literal-opener-body-boundary", literalOpenerBodyBoundary, {
    valid: [
      fixture(
        "opener already moved",
        before
          .replace(caller, `seq(${use}, $._terminator)`)
          .replace(body, `seq("@", ${name}, ${clause})`),
      ),
      fixture("keyword opener", before.replace('"@"', '"ANNOTATION"')),
      fixture("token opener", before.replace('"@"', 'token("@")')),
      fixture("right operand opener", before.replace(caller, `seq(${use}, "@", $._terminator)`)),
      fixture("aliased body use", before.replace(use, `alias(${use}, $.body)`)),
      fixture("optional body use", before.replace(use, `optional(${use})`)),
      fixture("precedence wrapper", before.replace(caller, `prec.right(${caller})`)),
      fixture("private outer rule", before.replace("  annotation:", "  __annotation:")),
      fixture("missing terminator", before.replace(", $._terminator", "")),
      fixture("missing name alias", before.replace(name, 'field("name", $.__annotation_name)')),
      fixture("private name alias target", before.replace("$.identifier", "$.__identifier")),
      fixture("required tail", before.replace(clause, clause.slice(9, -1))),
      fixture(
        "required clause content",
        before.replace(
          "optional(alias($.__annotation_attributes, $.attributes))",
          "alias($.__annotation_attributes, $.attributes)",
        ),
      ),
      fixture("unbalanced clause", before.replace('\")\"', '\"]\"')),
      fixture("additional use", `${before}\nconst use = ($) => ${use};`),
      fixture("computed additional use", `${before}\nconst use = ($) => $["__annotation_body"];`),
      fixture("dynamic use", `${before}\nconst use = ($) => $[name];`),
      fixture("spread into rules", before.replace("() => ({", "() => ({ ...otherRules,")),
      fixture("recursive dependency on body", before.replace(attributes, use)),
      fixture("recursive dependency on owner", before.replace(attributes, "$.annotation")),
      fixture("dynamic local dependency", before.replace(attributes, "makeRule($)")),
      fixture("inline metadata", before.replaceAll("__annotation_body", "__inline_body")),
      fixture(
        "precedence metadata on owner",
        before.replace("  annotation:", "  restricted_annotation:"),
      ),
      fixture("cross-file use", before.replaceAll("__annotation_body", "__external_body")),
      fixture("owner use in same-file metadata", `${before}\nconst meta = ($) => [$.annotation];`),
      fixture(
        "outer suppression",
        before.replace("  annotation:", `  ${suppression}\n  annotation:`),
      ),
      fixture(
        "definition suppression",
        before.replace(definition, `${suppression}\n  ${definition}`),
      ),
      fixture("field suppression", before.replace(name, `\n    ${suppression}\n    ${name}`)),
      fixture("body use suppression", before.replace(use, `\n    ${suppression}\n    ${use}`)),
    ],
    invalid: [
      { ...fixture("annotation opener and attributes"), errors: [{ message }] },
      {
        ...fixture(
          "same shape with another local body and bracketed clause",
          before.replaceAll("annotation", "tag").replace('"("', '"["').replace('\")\"', '\"]\"'),
        ),
        errors: [{ message }],
      },
    ],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
