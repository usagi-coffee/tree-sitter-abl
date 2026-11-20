import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { RuleTester } from "oxlint/plugins-dev";
import { valueDeclarationTailExtraction } from "../oxlint/index.js";

const ruleId = "value-declaration-tail-extraction";
const name = "__trigger_procedure_value_body";
const declaration = `${name}: ($) =>`;
const optionName = "__trigger_procedure_options";
const optionDefinition = `${optionName}: ($) =>`;
const marker = "optional($._kw_value)";
const value = 'field("value", $.identifier)';
const as = 'seq($._kw_as, field("data_type", $.identifier))';
const like = 'seq($._kw_like, field("like_field", $.qualified_name))';
const selector = `choice(${as}, ${like})`;
const options = `optional($.${optionName})`;
const tail = `seq(${selector}, ${options})`;
const body = `seq(${marker}, ${value}, ${selector}, ${options})`;
const prefix = "__trigger_procedure_prefix";
const oldUse = `seq($._kw_old, $.${name})`;
const optionSequence = `prec.right(seq($.__trigger_procedure_option, optional($.${optionName})))`;
const before = `export default ({ kw }) => ({
  trigger_procedure_statement: ($) => seq($.${prefix}, $._terminator),
  ${prefix}: ($) => seq(
    kw("TRIGGER"), $._kw_procedure, $._kw_for, $._kw_assign,
    seq(seq($._kw_new, $.${name}), optional(${oldUse})),
  ),
  ${declaration} ${body},
  ${optionDefinition} ${optionSequence},
  __trigger_procedure_option: ($) =>
    choice(seq(kw("INITIAL"), field("initial", $._expression)), alias($._kw_no_undo, $.no_undo)),
});`;
const existing = `__trigger_procedure_value_declaration: ($) => ${tail},`;
const withExisting = before.replace(optionDefinition, `${existing}\n  ${optionDefinition}`);
const after = withExisting.replace(
  body,
  `seq(${marker}, ${value}, $.__trigger_procedure_value_declaration)`,
);

const directory = mkdtempSync(join(tmpdir(), "abl-value-declaration-tail-"));
const grammarDirectory = join(directory, "grammar");
const grammar = join(directory, "grammar.js");
const fixture = (description, code = before) => ({
  name: description,
  code,
  cwd: directory,
  filename: join(grammarDirectory, "statements", "trigger-procedure.js"),
});
const warning = {
  message:
    /extracting the required AS or LIKE choice and its optional value options.*one hidden tail/,
};

try {
  const precedence = join(grammarDirectory, "precedences");
  mkdirSync(precedence, { recursive: true });
  writeFileSync(grammar, "export default grammar({});");
  new RuleTester().run(ruleId, valueDeclarationTailExtraction, {
    valid: [
      fixture("type and options already extracted", after),
      fixture("equivalent sequence already exists", withExisting),
      fixture("only one reference", before.replace(`optional(${oldUse})`, "$.other")),
      fixture("no optional VALUE marker", before.replace(marker, "$._kw_value")),
      fixture("other marker", before.replace(marker, "optional($._kw_buffer)")),
      fixture(
        "aliased value",
        before.replace(value, 'field("value", alias($.identifier, $.name))'),
      ),
      fixture("repeated field", before.replace('"data_type"', '"value"')),
      fixture("dynamic field name", before.replace('"data_type"', "label")),
      fixture("computed field value", before.replace("$.qualified_name", "$[which]")),
      fixture("optional type", before.replace(selector, `optional(${selector})`)),
      fixture("aliased type", before.replace(selector, `alias(${selector}, $.type)`)),
      fixture("lexical keyword", before.replace(as, as.replace("$._kw_as", 'token("AS")'))),
      fixture("missing LIKE branch", before.replace(like, like.replace("_kw_like", "_kw_as"))),
      fixture("third type branch", before.replace(like, `${like}, seq(kw("IS"), ${value})`)),
      fixture(
        "swapped value and type",
        before.replace(`${value}, ${selector}`, `${selector}, ${value}`),
      ),
      fixture("required options", before.replace(options, `$.${optionName}`)),
      fixture("external options", before.replace(options, "optional($._global_options)")),
      fixture("different local owner", before.replaceAll(optionName, "__other_options")),
      fixture("scalar option helper", before.replace(optionSequence, "$.other")),
      fixture(
        "recursive reference through options",
        before.replace('seq(kw("INITIAL"),', `seq($.${name},`),
      ),
      fixture(
        "recursive reference through value",
        before.replace(value, `field("value", $.${name})`),
      ),
      fixture("dynamic reference outside the rule map", `${before}\nconst use = ($) => $[which];`),
      fixture("rule map spread", before.replace(declaration, `...rules,\n  ${declaration}`)),
      fixture(
        "duplicate declaration",
        before.replace(declaration, `${declaration} $.other,\n  ${declaration}`),
      ),
      fixture("alias at a caller", before.replace(oldUse, `alias(${oldUse}, $.old_value)`)),
      fixture("precedence at the declaration", before.replace(body, `prec.right(${body})`)),
      fixture("field at a caller", before.replace(oldUse, `field("old", ${oldUse})`)),
      fixture("token at a caller", before.replace(oldUse, `token(${oldUse})`)),
      ...[declaration, marker, value, selector, as, like, options, optionDefinition, oldUse].map(
        (part) =>
          fixture(
            `suppression at ${part}`,
            before.replace(part, `\n// oxlint-disable-next-line rule-to-test/${ruleId}\n${part}`),
          ),
      ),
    ],
    invalid: [
      { ...fixture("ASSIGN value declaration"), errors: [warning] },
      {
        ...fixture(
          "static keyword options and reversed alternatives",
          before
            .replace(
              selector,
              `choice(${like}, ${as.replace("$._kw_as", 'kw("AS", { offset: 2 })')})`,
            )
            .replace(marker, 'optional(kw("VALUE", { offset: 3 }))'),
        ),
        errors: [warning],
      },
    ],
  });

  for (const [key, symbol] of [
    ["inline", name],
    ["conflicts", optionName],
    ["supertypes", name],
    ["externals", name],
    ["extras", optionName],
    ["word", optionName],
    ["precedences", prefix],
  ]) {
    const reference = `$.${symbol}`;
    const nested = ["conflicts", "precedences"].includes(key) ? `[${reference}]` : reference;
    const metadata = key === "word" ? reference : `[${nested}]`;
    writeFileSync(grammar, `export default grammar({ ${key}: ($) => ${metadata} });`);
    new RuleTester().run(ruleId, valueDeclarationTailExtraction, {
      valid: [fixture(`referenced in ${key}`)],
      invalid: [],
    });
  }

  writeFileSync(grammar, "export default grammar({});");
  const precedenceFile = join(precedence, "trigger-procedure.js");
  writeFileSync(precedenceFile, `export default ($) => [[$.${optionName}, $.other]];`);
  new RuleTester().run(ruleId, valueDeclarationTailExtraction, {
    valid: [fixture("options participate in project precedence")],
    invalid: [],
  });
  rmSync(precedenceFile);
  writeFileSync(join(grammarDirectory, "other.js"), `export default { other: ($) => $.${name} };`);
  new RuleTester().run(ruleId, valueDeclarationTailExtraction, {
    valid: [fixture("declaration referenced by another grammar module")],
    invalid: [],
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
