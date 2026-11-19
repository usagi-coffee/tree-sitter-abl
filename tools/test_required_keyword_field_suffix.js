import { RuleTester } from "oxlint/plugins-dev";
import { singleUseKeywordSequence } from "../oxlint/index.js";

const action =
  'field("action", choice(alias($._kw_get, $.identifier), alias(kw("REQUEST"), $.identifier)))';
const use = `seq(${action}, $.__dde_target_item_body)`;
const body =
  'seq(field("ddeid", $._expression), $._kw_target, field("target", $._assignable), $.__dde_item_time_body)';
const definition = `__dde_target_item_body: ($) => ${body},`;
const before = `export default grammar({ rules: {
  __dde_prefix: ($) => seq(kw("DDE"), choice(
    seq(kw("SEND"), $.__dde_item_time_body),
    ${use},
  )),
  ${definition}
  __dde_item_time_body: ($) => seq(kw("ITEM"), field("item", $._expression)),
} });`;
const message =
  /one unaliased choice-arm suffix use.*required fields and keyword.*shared trailing helper/;

new RuleTester().run("single-use-keyword-sequence", singleUseKeywordSequence, {
  valid: [
    before.replace(use, `seq(${action}, ${body.slice(4, -1)})`).replace(definition, ""),
    before.replace(use, `seq(${action}, $.__dde_target_item_body, $.extra)`),
    before.replace(use, `seq($.__dde_target_item_body, ${action})`),
    before.replace(use, "alias($.__dde_target_item_body, $.branch)"),
    before.replace(use, "optional($.__dde_target_item_body)"),
    before.replace(use, "seq(kw('GET'), $.__dde_target_item_body)"),
    before.replace(use, `field("branch", ${use})`),
    before.replace(use, `alias(${use}, $.branch)`),
    before.replace(use, `token(${use})`),
    before.replace(use, `prec.dynamic(1, ${use})`),
    before.replace(use, `${use}, ${use}`),
    before.replace('alias(kw("REQUEST"), $.identifier)', 'alias(kw("REQUEST"), $.request)'),
    before.replace('alias(kw("REQUEST"), $.identifier)', "alias(kw(command), $.identifier)"),
    before.replace('field("target", $._assignable)', 'field("ddeid", $._assignable)'),
    before.replace('field("target", $._assignable)', 'field("action", $._assignable)'),
    before.replace('field("target", $._assignable)', 'optional(field("target", $._assignable))'),
    before.replace('field("target", $._assignable)', 'field("target", $.__dde_target_item_body)'),
    before.replace("$._kw_target", "$.marker"),
    before.replace(
      "$._assignable), $.__dde_item_time_body",
      "$._assignable), optional($.__dde_item_time_body)",
    ),
    before.replace('seq(kw("SEND"), $.__dde_item_time_body)', 'seq(kw("SEND"), $.different)'),
    before.replace("rules: {", "rules: { ...others,"),
    before.replace("rules: {", "inline: ($) => [$.__dde_target_item_body], rules: {"),
    before.replace("rules: {", "conflicts: ($) => [[$.__dde_prefix, $.other]], rules: {"),
    `${before}\nconst computedUse = ($) => $[name];`,
    before.replace(
      definition,
      `// oxlint-disable-next-line rule-to-test/single-use-keyword-sequence\n  ${definition}`,
    ),
    before.replace(
      use,
      `// oxlint-disable-next-line rule-to-test/single-use-keyword-sequence\n    ${use}`,
    ),
  ].map((code) => ({ code, filename: "grammar.js" })),
  invalid: [
    { code: before, errors: [{ message }] },
    {
      code: before.replace("$._kw_target", 'kw("TARGET", { offset: 4 })'),
      errors: [{ message }],
    },
  ],
});
