import { RuleTester } from "oxlint/plugins-dev";
import { persistentRunSuffixExtraction } from "../oxlint/index.js";

const argumentList = "optional($.arguments)";
const inPhrase = "alias($.__on_in_phrase, $.in_phrase)";
const inContext = 'seq($._kw_in, field("context", $.__on_context_value))';
const suffix = `${argumentList},\n      optional(${inPhrase}),\n      ${argumentList}`;
const branch = `seq(
      kw("PERSISTENT"),
      $._kw_run,
      field("procedure", $.identifier),
      ${suffix},
      $._terminator,
    )`;
const action = `choice($.__on_revert_action, $._statement, ${branch})`;
const rules = `
  __on_trigger_action: ($) => ${action},
  __on_in_phrase: ($) => ${inContext},
  __on_context_value: ($) => choice($.system_handle_identifier, $.object_access, $._qualified_identifier),
`;
const before = `export default ({ kw }) => ({${rules}});`;
const after = before.replace(suffix, "optional($.__on_persistent_run_suffix)").replace(
  "\n});",
  `
  __on_persistent_run_suffix: ($) =>
    choice(seq($.arguments, optional(choice($.__on_persistent_run_context, $.arguments))),
      $.__on_persistent_run_context),
  __on_persistent_run_context: ($) => seq(${inPhrase}, optional($.arguments)),
});`,
);
const rule = "persistent-run-suffix-extraction";
const suppression = `// oxlint-disable-next-line rule-to-test/${rule}`;
const message = /extracting the PERSISTENT RUN arguments and IN phrase.*up to two argument lists/;

new RuleTester().run(rule, persistentRunSuffixExtraction, {
  valid: [
    after,
    before.replace('kw("PERSISTENT")', 'kw("PERSISTENT", { offset: 4 })'),
    before.replace('kw("PERSISTENT")', "kw(keyword)"),
    before.replace("$._kw_run", 'kw("RUN")'),
    before.replace('field("procedure", $.identifier)', 'field("procedure", $.qualified_name)'),
    before.replace(argumentList, "$.arguments"),
    before.replace(argumentList, 'optional($["arguments"])'),
    before.replace(argumentList, "optional($.other_arguments)"),
    before.replace(suffix, `${argumentList}, ${argumentList}, optional(${inPhrase})`),
    before.replace(`optional(${inPhrase})`, inPhrase),
    before.replace(inPhrase, "$.__on_in_phrase"),
    before.replace("$.in_phrase", "$.procedure_context"),
    before.replace("$._terminator", "optional($._terminator)"),
    before.replace(branch, `prec.right(${branch})`),
    before.replace(action, `prec.right(${action})`),
    before.replace("__on_trigger_action:", "on_trigger_action:"),
    before.replace(inContext, `prec.left(${inContext})`),
    before.replace(inContext, inContext.replace('"context"', '"handle"')),
    before.replace("__on_in_phrase:", '["__on_in_phrase"]:'),
    before.replace("__on_in_phrase:", "__on_missing_phrase:"),
    before.replace("__on_in_phrase:", "__on_in_phrase: ($) => $.other,\n  __on_in_phrase:"),
    before.replace("__on_in_phrase:", "arguments: ($) => $.other,\n  __on_in_phrase:"),
    before.replace("=> ({", "=> ({ ...otherRules,"),
    before.replace("$._statement,", "...otherActions,"),
    before.replace("__on_trigger_action:", `${suppression}\n  __on_trigger_action:`),
    before.replace(branch, `\n    ${suppression}\n    ${branch}`),
    before.replace(argumentList, `${suppression}\n      ${argumentList}`),
    before.replace(`optional(${inPhrase})`, `${suppression}\n      optional(${inPhrase})`),
    before.replace("__on_in_phrase:", `${suppression}\n  __on_in_phrase:`),
    {
      filename: "grammar.js",
      code: `export default grammar({ inline: ($) => [$.__on_trigger_action], rules: {${rules}} });`,
    },
    {
      filename: "grammar.js",
      code: `export default grammar({ precedences: ($) => [[$.__on_in_phrase, $.other]], rules: {${rules}} });`,
    },
  ],
  invalid: [
    { code: before, errors: [{ message }] },
    {
      code: before.replace(
        branch,
        `\n    // oxlint-disable-next-line tree-sitter-optimize/optional-body-extraction\n    ${branch}`,
      ),
      errors: [{ message }],
    },
    {
      filename: "grammar.js",
      code: `export default grammar({ conflicts: ($) => [[$.__on_context_value, $.function_call]], rules: {${rules}} });`,
      errors: [{ message }],
    },
  ],
});
