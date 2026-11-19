import { RuleTester } from "oxlint/plugins-dev";
import { parenthesizedSignatureExtraction } from "../oxlint/index.js";

const parameters = `'(', optional($.__event_parameters), ')'`;
const signature = `seq(optional(kw("SIGNATURE")), $._kw_void, ${parameters})`;
const delegate =
  'seq(kw("DELEGATE"), optional($._kw_class), field("delegate_type", $._type_or_string))';
const list = 'seq($.__event_parameter, optional(seq(",", $.__event_parameters)))';
const rules = `
  __event_signature: ($) => choice(${signature}, ${delegate}),
  __event_parameters: ($) => ${list},
  __event_parameter: ($) => field("name", $.identifier),
`;
const fixture = `export default ({ kw }) => ({${rules}});`;
const suppression = "// oxlint-disable-next-line rule-to-test/parenthesized-signature-extraction";
const message = /extracting the parentheses and optional parameter list/;

new RuleTester().run("parenthesized-signature-extraction", parenthesizedSignatureExtraction, {
  valid: [
    fixture
      .replace(parameters, "$.__event_signature_parameters")
      .replace("\n});", `\n  __event_signature_parameters: ($) => seq(${parameters}),\n});`),
    fixture.replace(parameters, `'(', $.__event_parameters, ')'`),
    fixture.replace(parameters, `'(', optional($.__event_parameters), ']'`),
    fixture.replace('optional(kw("SIGNATURE"))', 'kw("SIGNATURE")'),
    fixture.replace("$._kw_void", "$._class_type"),
    fixture.replace(signature, `prec.right(${signature})`),
    fixture.replace(delegate, `alias(${delegate}, $.delegate)`),
    fixture.replace(`choice(${signature}, ${delegate})`, `choice(${delegate}, ${signature})`),
    fixture.replace(
      `choice(${signature}, ${delegate})`,
      `choice(${signature}, ${delegate}, $.third)`,
    ),
    fixture.replace("__event_signature:", "event_signature:"),
    fixture.replace("__event_signature:", '["__event_signature"]:'),
    fixture.replace("=> ({", "=> ({ ...rules,"),
    fixture.replace(list, 'seq($.__event_parameter, optional(seq(",", $.__other)))'),
    fixture.replace(list, "repeat1($.__event_parameter)"),
    fixture.replace("__event_parameters:", "__unrelated_parameters:"),
    fixture.replace("__event_signature:", `${suppression}\n  __event_signature:`),
    fixture.replace(parameters, `\n    ${suppression}\n    ${parameters}`),
    {
      filename: "grammar.js",
      code: `export default grammar({ inline: ($) => [$.__event_signature], rules: {${rules}} });`,
    },
  ],
  invalid: [
    { code: fixture, errors: [{ message }] },
    {
      code: fixture
        .replaceAll("__event_", "__callback_")
        .replace(
          "__callback_parameters:",
          "// oxlint-disable-next-line tree-sitter-optimize/single-use-sequence\n  __callback_parameters:",
        ),
      errors: [{ message }],
    },
  ],
});
