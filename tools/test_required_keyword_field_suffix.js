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

const compoundAction = 'field("action", alias(kw("INITIATE"), $.identifier))';
const compoundUse = `seq(${compoundAction}, $.__dde_initiate_body)`;
const compoundBody = `seq(
    field("ddeid", $._expression),
    $._frame_identifier_phrase,
    $._kw_application,
    field("application", $._expression),
    kw("TOPIC"),
    field("topic", $._expression),
  )`;
const compoundDefinition = `__dde_initiate_body: ($) => ${compoundBody},`;
const compoundBefore = `export default grammar({ rules: {
  __dde_prefix: ($) => seq(kw("DDE"), choice(
    seq(kw("TERMINATE"), field("ddeid", $._expression)),
    ${compoundUse},
  )),
  ${compoundDefinition}
} });`;
const compoundMessage =
  /choice-arm suffix use.*after a field-wrapped keyword alias.*required fields, shared phrase and keyword clauses/;
const disableKeywordSequence =
  "// oxlint-disable-next-line rule-to-test/single-use-keyword-sequence";

new RuleTester().run("single-use-keyword-sequence", singleUseKeywordSequence, {
  valid: [
    compoundBefore
      .replace(compoundUse, `seq(${compoundAction}, ${compoundBody.slice(4, -1)})`)
      .replace(compoundDefinition, ""),
    compoundBefore.replace(compoundUse, `seq(${compoundAction}, $.__dde_initiate_body, $.extra)`),
    compoundBefore.replace(compoundUse, `seq($.__dde_initiate_body, ${compoundAction})`),
    compoundBefore.replace(compoundUse, "alias($.__dde_initiate_body, $.branch)"),
    compoundBefore.replace(compoundUse, "seq(kw('INITIATE'), $.__dde_initiate_body)"),
    compoundBefore.replace(compoundUse, `field("branch", ${compoundUse})`),
    compoundBefore.replace(compoundUse, `alias(${compoundUse}, $.branch)`),
    compoundBefore.replace(compoundUse, `token(${compoundUse})`),
    compoundBefore.replace(compoundUse, `prec.dynamic(1, ${compoundUse})`),
    compoundBefore.replace(compoundUse, `${compoundUse}, ${compoundUse}`),
    compoundBefore.replace(
      'alias(kw("INITIATE"), $.identifier)',
      "alias(kw(action), $.identifier)",
    ),
    compoundBefore.replace(
      'alias(kw("INITIATE"), $.identifier)',
      'alias(kw("INITIATE"), $._hidden)',
    ),
    compoundBefore.replace("$._frame_identifier_phrase", "$.__private_phrase"),
    compoundBefore.replace("$._frame_identifier_phrase", "optional($._frame_identifier_phrase)"),
    compoundBefore.replace("$._frame_identifier_phrase", "$.frame_phrase"),
    compoundBefore.replace("$._kw_application", "$.application_marker"),
    compoundBefore.replace('kw("TOPIC")', 'kw("Application", { offset: 4 })'),
    compoundBefore.replace('field("topic", $._expression)', 'field("action", $._expression)'),
    compoundBefore.replace(
      'field("topic", $._expression)',
      'field("topic", $.__dde_initiate_body)',
    ),
    compoundBefore.replace(
      'field("topic", $._expression)',
      'optional(field("topic", $._expression))',
    ),
    compoundBefore.replace("rules: {", "rules: { ...others,"),
    compoundBefore.replace("rules: {", "inline: ($) => [$.__dde_initiate_body], rules: {"),
    compoundBefore.replace("rules: {", "conflicts: ($) => [[$.__dde_prefix, $.other]], rules: {"),
    `${compoundBefore}\nconst computedUse = ($) => $[name];`,
    compoundBefore.replace(
      compoundDefinition,
      `${disableKeywordSequence}\n  ${compoundDefinition}`,
    ),
    compoundBefore.replace(compoundUse, `${disableKeywordSequence}\n    ${compoundUse}`),
    compoundBefore.replace('kw("TOPIC")', `${disableKeywordSequence}\n    kw("TOPIC")`),
  ].map((code) => ({ code, filename: "grammar.js" })),
  invalid: [
    { code: compoundBefore, errors: [{ message: compoundMessage }] },
    {
      code: compoundBefore
        .replaceAll("__dde_prefix", "__example_prefix")
        .replaceAll("__dde_initiate_body", "__example_begin_body")
        .replaceAll("$._frame_identifier_phrase", "$._context_phrase")
        .replace('kw("INITIATE")', "$._kw_begin")
        .replace('kw("TOPIC")', "$._kw_destination"),
      errors: [{ message: compoundMessage }],
    },
  ],
});
