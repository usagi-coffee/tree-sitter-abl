import { RuleTester } from "oxlint/plugins-dev";
import { promptColorClauseExtraction } from "../oxlint/index.js";

const clause = 'seq($._kw_prompt, field("prompt_color", $.__frame_color_value))';
const prompt = `optional(${clause})`;
const color = 'field("color", $.__frame_color_value)';
const option = `seq($._kw_color, optional($._kw_display), ${color}, ${prompt})`;
const rule = "prompt-color-clause-extraction";
const suppression = `// oxlint-disable-next-line rule-to-test/${rule}`;
const message = /extracting the PROMPT keyword and its color field.*Keep the clause optional/;
const before = `export default () => ({
  __frame_option: ($) => choice($.unrelated_option, ${option}),
  __frame_color_value: ($) => choice($._kw_normal, $._kw_input, $._kw_messages, $.color_phrase),
});`;
const after = before
  .replace(prompt, "optional($.__frame_prompt_color)")
  .replace("\n});", `\n  __frame_prompt_color: ($) => ${clause},\n});`);

new RuleTester().run(rule, promptColorClauseExtraction, {
  valid: [
    after,
    before.replace(prompt, clause),
    before.replace(prompt, `alias(${prompt}, $.prompt)`),
    before.replace(clause, `prec.right(${clause})`),
    before.replace(option, `prec.right(${option})`),
    before.replace("optional($._kw_display)", "$._kw_display"),
    before.replace("$._kw_prompt", "$._kw_display"),
    before.replace(clause, clause.replace("$.__frame_color_value", "$.__other_value")),
    before.replace('"prompt_color"', '"color"'),
    before.replace(color, "$.__frame_color_value"),
    before.replace("$._kw_messages, ", ""),
    before.replace("__frame_color_value:", '["__frame_color_value"]:'),
    before.replace("() => ({", "() => ({ ...otherRules,"),
    before.replace("__frame_option:", "frame_option:"),
    before.replace("__frame_option:", `${suppression}\n  __frame_option:`),
    before.replace(option, `\n    ${suppression}\n    ${option}`),
    before.replace(prompt, `\n    ${suppression}\n    ${prompt}`),
  ],
  invalid: [
    { code: before, errors: [{ message }] },
    {
      code: before
        .replaceAll("__frame_", "__widget_")
        .replace(
          "__widget_color_value:",
          "// oxlint-disable-next-line tree-sitter-optimize/shared-choice\n  __widget_color_value:",
        ),
      errors: [{ message }],
    },
  ],
});
