import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { singleUseOptionBodyInline } from "../oxlint/index.js";

const ruleId = "single-use-option-body-inline";
const use = "$._material";
const field = 'field("payload", $.label)';
const options = 'repeat(choice(seq("note", field("text", $.quoted)), alias("once", $.once)))';
const body = `  _material: ($) => seq(${field}, ${options}),\n`;
const opener = 'seq($._prefix, choice($._direct, "group"), $._material)';
const outer = 'seq($._dispatch, ";")';
const rules = `{
  channel: ($) => ${outer},
  _dispatch: ($) => ${opener},
${body}  _prefix: () => "route",
  _direct: () => "direct",
  label: () => /[a-z]+/,
  quoted: () => /"[^"]*"/,
}`;
const standalone = `export default grammar({ name: "channels", rules: ${rules} });`;
const standaloneAfter = standalone.replace(use, `${field}, ${options}`).replace(body, "");
const modular = `export default ({ kw }) => (${rules.replace("$._prefix,", 'kw("route"),')});`;
const message =
  /_material has one direct trailing use in _dispatch.*_dispatch boundary and channel suffix/;
const directory = mkdtempSync(join(tmpdir(), "tree-sitter-option-body-"));
const modulePath = join(directory, "modules", "forms", "routes.js");
const fixture = (name, code = standalone, filename = join(directory, "grammar.js")) => ({
  name,
  code,
  cwd: directory,
  filename,
});
const mute = `// oxlint-disable-next-line rule-to-test/${ruleId}`;

try {
  mkdirSync(join(directory, "modules", "forms"), { recursive: true });
  writeFileSync(
    join(directory, "grammar.js"),
    `import routes from "./modules/forms/routes.js";
     export default grammar({ rules: { ...routes() }, inline: ($) => [$._inline_material] });`,
  );
  writeFileSync(
    join(directory, "modules", "other.mjs"),
    `export default () => ({ other: ($) => $._external_material, use_prefix: ($) => $._external_dispatch });`,
  );
  new RuleTester().run(ruleId, singleUseOptionBodyInline, {
    valid: [
      fixture("already inlined", standaloneAfter),
      fixture("named body", standalone.replaceAll("_material", "material")),
      fixture("missing selector", standalone.replace('choice($._direct, "group")', "$._direct")),
      fixture("nullable selector", standalone.replace('"group"', 'optional("group")')),
      fixture("optional field", standalone.replace(field, `optional(${field})`)),
      fixture("required options", standalone.replace("repeat(choice(", "repeat1(choice(")),
      fixture("non-choice options", standalone.replace(options, 'repeat("once")')),
      fixture("field-wrapped use", standalone.replace(use, `field("nested", ${use})`)),
      fixture("aliased use", standalone.replace(use, `alias(${use}, $.part)`)),
      fixture("nonfinal use", standalone.replace(use, `${use}, ":"`)),
      fixture("multi-use body", standalone.replace(use, `${use}, ${use}`)),
      fixture("static computed second use", `${standalone}\nconst extra = ($) => $["_material"];`),
      fixture("dynamic reference", `${standalone}\nconst extra = ($) => $[key];`),
      fixture("opaque rule object use", `${standalone}\nconst extra = ($) => readRules($);`),
      fixture(
        "opaque local dependency",
        standalone.replace("label: () => /[a-z]+/", "label: makeLabel()"),
      ),
      fixture("multi-use prefix", standalone.replace(outer, 'seq($._dispatch, $._dispatch, ";")')),
      fixture("prefix use under precedence", standalone.replace(outer, `prec(1, ${outer})`)),
      fixture("first hidden rule retained", standalone.replace("channel:", "_channel:")),
      fixture(
        "metadata reference",
        standalone.replace('name: "channels",', "inline: ($) => [$._material],"),
      ),
      fixture(
        "indirect recursive dependency",
        standalone.replace("label: () => /[a-z]+/", "label: ($) => $._dispatch"),
      ),
      fixture("dynamic rule map", standalone.replace("  channel:", "  ...imported,\n  channel:")),
      fixture("suppressed candidate", standalone.replace(body, `  ${mute}\n${body}`)),
      fixture("external metadata", modular.replaceAll("_material", "_inline_material"), modulePath),
      fixture(
        "sibling module body use",
        modular.replaceAll("_material", "_external_material"),
        modulePath,
      ),
      fixture(
        "sibling module prefix use",
        modular.replaceAll("_dispatch", "_external_dispatch"),
        modulePath,
      ),
    ],
    invalid: [
      { ...fixture("standalone grammar with lexical callbacks"), errors: [{ message }] },
      {
        ...fixture("modular factory under unrelated directory", modular, modulePath),
        errors: [{ message }],
      },
    ],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
