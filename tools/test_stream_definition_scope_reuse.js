import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { streamDefinitionScopeReuse } from "../oxlint/index.js";

const ruleId = "stream-definition-scope-reuse";
const prefixName = "__stream_prefix";
const modifierName = "__stream_modifier";
const sharedName = "_definition_scope_modifier";
const newAlias = "alias($._kw_new, $.new_modifier)";
const globalAlias = 'alias(kw("GLOBAL"), $.scope_modifier)';
const sharedAlias = 'alias(kw("SHARED"), $.scope_modifier)';
const privateAlias = 'alias(kw("PRIVATE"), $.access_modifier)';
const modifier = `choice(seq(${newAlias}, optional(${globalAlias}), ${sharedAlias}), ${sharedAlias}, ${privateAlias})`;
const before = `export default ({ kw }) => ({
  stream_definition: ($) => seq($.__stream_prefix, $._terminator),
  __stream_prefix: ($) =>
    seq($._kw_define, optional($.__stream_modifier), $._kw_stream, field("name", $.identifier)),
  __stream_modifier: ($) => ${modifier},
});`;
const after = before.replace(
  modifier,
  `choice(seq(${newAlias}, ${globalAlias}, ${sharedAlias}), $.${sharedName})`,
);
const sharedRule = `${sharedName}: ($) =>
  choice(seq(${newAlias}, ${sharedAlias}), ${sharedAlias}, ${privateAlias},)`;
const sharedModule = (property = sharedRule) => `export default ({ kw }) => ({
  _define_scope_prefix: ($) => seq($._kw_define, optional($.${sharedName})),
  ${property},
});`;
const message =
  /reusing _definition_scope_modifier for NEW SHARED, SHARED, and PRIVATE.*Keep NEW GLOBAL SHARED explicit/;
const append = (property) => before.replace("\n});", "\n  " + property + ",\n});");
const suppress = (rule = "rule-to-test/" + ruleId) =>
  before.replace(
    modifierName + ":",
    "// oxlint-disable-next-line " + rule + "\n  " + modifierName + ":",
  );

const directory = mkdtempSync(join(tmpdir(), "abl-stream-definition-scope-reuse-"));
const fixture = (name, code = before, filename = "stream.js") => ({
  name,
  code,
  cwd: directory,
  filename: join(directory, "grammar", "statements", filename),
});

try {
  mkdirSync(join(directory, "grammar", "core"), { recursive: true });
  mkdirSync(join(directory, "grammar", "statements"));
  mkdirSync(join(directory, "grammar", "precedences"));
  const commonPath = join(directory, "grammar", "core", "common.js");
  writeFileSync(commonPath, "// The clause keeps its existing users.\n" + sharedModule());

  new RuleTester().run(ruleId, streamDefinitionScopeReuse, {
    valid: [
      fixture("measured reuse", after),
      fixture("same grammar in another module", before, "other.js"),
      fixture("different prefix field", before.replace('field("name"', 'field("stream"')),
      fixture("different stream keyword", before.replace("$._kw_stream", "$._kw_stream_handle")),
      fixture(
        "required declaration scope",
        before.replace("optional($.__stream_modifier)", "$.__stream_modifier"),
      ),
      fixture("different declaration terminator", before.replace("$._terminator", '"."')),
      fixture("required GLOBAL", before.replace(`optional(${globalAlias})`, globalAlias)),
      fixture(
        "different GLOBAL alias",
        before.replace(globalAlias, 'alias(kw("GLOBAL"), $.global_modifier)'),
      ),
      fixture(
        "different GLOBAL keyword options",
        before.replace('kw("GLOBAL")', 'kw("GLOBAL", { offset: 3 })'),
      ),
      fixture(
        "different NEW alias",
        before.replace(newAlias, "alias($._kw_new, $.scope_modifier)"),
      ),
      fixture(
        "different PRIVATE alias",
        before.replace(privateAlias, 'alias(kw("PRIVATE"), $.scope_modifier)'),
      ),
      fixture(
        "changed alias order within the NEW branch",
        before.replace(
          `seq(${newAlias}, optional(${globalAlias}), ${sharedAlias})`,
          `seq(${newAlias}, ${sharedAlias}, optional(${globalAlias}))`,
        ),
      ),
      fixture(
        "changed modifier alternative order",
        before.replace(
          modifier,
          `choice(seq(${newAlias}, optional(${globalAlias}), ${sharedAlias}), ${privateAlias}, ${sharedAlias})`,
        ),
      ),
      fixture("wrapped precedence", before.replace(modifier, "prec.right(" + modifier + ")")),
      fixture("local shared scope replacement", append(sharedRule)),
      fixture("local shared keyword replacement", append('_kw_new: ($) => kw("NEW")')),
      fixture("local scope alias target", append("scope_modifier: ($) => $.other")),
      fixture(
        "aliased local modifier use",
        append("other: ($) => alias($.__stream_modifier, $.other)"),
      ),
      fixture("additional local prefix use", append("other: ($) => $.__stream_prefix")),
      fixture(
        "computed modifier property",
        before.replace(modifierName + ":", '["' + modifierName + '"]:'),
      ),
      fixture("spread rule map", before.replace("=> ({", "=> ({ ...otherRules,")),
      fixture("local suppression", suppress()),
    ],
    invalid: [
      { ...fixture("measured original"), errors: [{ message }] },
      {
        ...fixture("unrelated suppression", suppress("rule-to-test/optional-tail-choice-collapse")),
        errors: [{ message }],
      },
    ],
  });

  const blockedSharedModules = [
    ["missing shared scope", sharedModule("_other_scope: ($) => $.other")],
    [
      "shared scope name only in a comment",
      "/* " + sharedModule() + " */\n" + sharedModule("_other_scope: ($) => $.other"),
    ],
    [
      "shared scope has an extra alternative",
      sharedModule(sharedRule.replace(`${privateAlias},)`, `${privateAlias}, kw("PROTECTED"),)`)),
    ],
    [
      "shared scope alias differs",
      sharedModule(sharedRule.replace(privateAlias, 'alias(kw("PRIVATE"), $.scope_modifier)')),
    ],
    [
      "shared scope alternative order differs",
      sharedModule(
        sharedRule.replace(
          `seq(${newAlias}, ${sharedAlias}), ${sharedAlias}`,
          `${sharedAlias}, seq(${newAlias}, ${sharedAlias})`,
        ),
      ),
    ],
    ["shared scope duplicate", sharedModule(sharedRule + ", " + sharedRule)],
    [
      "shared scope method override",
      sharedModule(sharedRule + ", " + sharedName + "($) { return $.other; }"),
    ],
    [
      "shared scope getter override",
      sharedModule(sharedRule + ", get " + sharedName + "() { return () => $.other; }"),
    ],
    ["shared scope map spread", sharedModule(sharedRule + ", ...otherRules")],
    ["shared rule map discarded by expression", sharedModule().replace("});", "}, otherRules);")],
    [
      "shared scope computed replacement",
      sharedModule(sharedRule + ', ["' + sharedName + '"]: ($) => $.other'),
    ],
    [
      "shared scope computed string expression replacement",
      sharedModule(sharedRule + ', ["_definition_" + "scope_modifier"]: ($) => $.other'),
    ],
  ];
  for (const [name, source] of blockedSharedModules) {
    writeFileSync(commonPath, source);
    new RuleTester().run(ruleId + " " + name, streamDefinitionScopeReuse, {
      valid: [fixture(name)],
      invalid: [],
    });
  }

  writeFileSync(commonPath, sharedModule());
  const grammarPath = join(directory, "grammar.js");
  const blockedMetadata = [
    [
      "external computed modifier use",
      join(directory, "grammar", "statements", "other.js"),
      'export default ({ kw }) => ({ other: ($) => $["' + modifierName + '"] });',
    ],
    [
      "stream definition in a root conflict",
      grammarPath,
      "export default grammar({ conflicts: ($) => [[$.stream_definition, $.other]] });",
    ],
    [
      "shared scope in root inline metadata",
      grammarPath,
      "export default grammar({ inline: ($) => [$." + sharedName + "] });",
    ],
    [
      "shared scope in precedence metadata",
      join(directory, "grammar", "precedences", "other.js"),
      "export default ($) => [[$." + sharedName + ", $.other]];",
    ],
  ];
  for (const [name, filename, source] of blockedMetadata) {
    writeFileSync(filename, source);
    new RuleTester().run(ruleId + " " + name, streamDefinitionScopeReuse, {
      valid: [fixture(name)],
      invalid: [],
    });
    rmSync(filename);
  }
} finally {
  rmSync(directory, { recursive: true, force: true });
}
