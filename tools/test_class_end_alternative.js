import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { classEndAlternative } from "../oxlint/index.js";

const name = "class-end-alternative";
const body =
  'seq(field("name", $._type_name), optional($.__class_options), $.__class_definition_compound_body)';
const compound = `seq(
    $.__class_body_opener,
    optional($.__class_definition_items),
    $._kw_end,
    optional($._kw_class),
  )`;
const items = "choice($.method_definition, alias($.class_data_source, $.data_source_definition))";
const list = `prec.right(seq(${items}, optional($.__class_definition_items)))`;
const before = `export default ({ kw }) => ({
  __class_body: ($) => ${body},
  __class_definition_compound_body: ($) => ${compound},
  __class_definition_items: ($) => ${list},
  __class_body_opener: ($) => choice(alias($._colon, ":"), $._terminator_dot),
});`;
const after = before
  .replace(
    compound,
    "seq($.__class_body_opener, $.__class_definition_items, optional($._kw_class))",
  )
  .replace(list, `choice(prec.right(seq(${items}, $.__class_definition_items)), $._kw_end)`);

const directory = mkdtempSync(join(tmpdir(), "abl-class-end-"));
const fixture = (label, code = before) => ({
  name: label,
  code,
  cwd: directory,
  filename: join(directory, "grammar", "statements", "class.js"),
});
const addRule = (rule) => before.replace("\n});", `\n  ${rule},\n});`);
const suppress = (part, rule = `rule-to-test/${name}`) =>
  before.replace(part, `\n  // oxlint-disable-next-line ${rule}\n  ${part}`);
const message =
  /moving required END.*right-recursive class member list.*aliases in order.*right precedence.*optional CLASS in the compound body/;

try {
  mkdirSync(join(directory, "grammar", "statements"), { recursive: true });
  mkdirSync(join(directory, "grammar", "precedences"));
  new RuleTester().run(name, classEndAlternative, {
    valid: [
      fixture("already factored terminal END", after),
      fixture("optional END", before.replace("$._kw_end,", "optional($._kw_end),")),
      fixture("different END", before.replace("$._kw_end,", "$._kw_return,")),
      fixture("required CLASS", before.replace("optional($._kw_class)", "$._kw_class")),
      fixture("no CLASS suffix", before.replace("    optional($._kw_class),\n", "")),
      fixture(
        "different terminator order",
        before.replace(
          "$._kw_end,\n    optional($._kw_class),",
          "optional($._kw_class),\n    $._kw_end,",
        ),
      ),
      fixture(
        "required recursive list",
        before.replace(
          compound,
          compound.replace("optional($.__class_definition_items)", "$.__class_definition_items"),
        ),
      ),
      fixture(
        "required recursive continuation",
        before.replace(
          list,
          list.replace("optional($.__class_definition_items)", "$.__class_definition_items"),
        ),
      ),
      fixture("left precedence", before.replace("prec.right", "prec.left")),
      fixture("named precedence", before.replace("prec.right(seq", 'prec.right("member", seq')),
      fixture("singleton instead of member choice", before.replace(items, "$.method_definition")),
      fixture(
        "duplicate member alternatives",
        before.replace(items, "choice($.method_definition, $.method_definition)"),
      ),
      fixture(
        "END in the member choice",
        before.replace(items, "choice($.method_definition, $._kw_end)"),
      ),
      fixture(
        "member choice calls a helper",
        before.replace(items, "choice($.method_definition, helper($))"),
      ),
      fixture(
        "alias on the compound body",
        before.replace(
          body,
          body.replace(
            "$.__class_definition_compound_body",
            "alias($.__class_definition_compound_body, $.body)",
          ),
        ),
      ),
      fixture(
        "alias on the list",
        before.replace(
          compound,
          compound.replace(
            "optional($.__class_definition_items)",
            "optional(alias($.__class_definition_items, $.items))",
          ),
        ),
      ),
      fixture("second local list use", addRule("other: ($) => $.__class_definition_items")),
      fixture(
        "second local compound body use",
        addRule("other: ($) => $.__class_definition_compound_body"),
      ),
      fixture(
        "duplicate rule definition",
        addRule("__class_definition_items: ($) => $.method_definition"),
      ),
      fixture(
        "computed property",
        before.replace("__class_definition_items: ($)", '["__class_definition_items"]: ($)'),
      ),
      fixture("computed reference", addRule("other: ($) => $[unknown]")),
      fixture("spread rule map", before.replace("=> ({", "=> ({ ...otherRules,")),
      ...["__class_definition_compound_body:", "__class_definition_items:", "$._kw_end,"].map(
        (part) => fixture(`targeted suppression at ${part}`, suppress(part)),
      ),
    ],
    invalid: [
      { ...fixture("original shape with an aliased member"), errors: [{ message }] },
      {
        ...fixture("unrelated suppression", suppress("$._kw_end,", "rule-to-test/shared-sequence")),
        errors: [{ message }],
      },
    ],
  });

  const rootGrammar = join(directory, "grammar.js");
  writeFileSync(
    rootGrammar,
    "export default grammar({ inline: ($) => [$.__class_definition_items] });",
  );
  new RuleTester().run(`${name} external inline metadata`, classEndAlternative, {
    valid: [fixture("the member list is inline")],
    invalid: [],
  });
  rmSync(rootGrammar);

  const precedence = join(directory, "grammar", "precedences", "class.js");
  writeFileSync(
    precedence,
    "export default ($) => [[$.__class_definition_compound_body, $.other]];",
  );
  new RuleTester().run(`${name} precedence metadata`, classEndAlternative, {
    valid: [fixture("the compound body participates in precedence")],
    invalid: [],
  });
  rmSync(precedence);

  writeFileSync(
    join(directory, "grammar", "statements", "other.js"),
    "export default () => ({ other: ($) => $.__class_definition_items });",
  );
  new RuleTester().run(`${name} external member list use`, classEndAlternative, {
    valid: [fixture("the member list is shared across files")],
    invalid: [],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
