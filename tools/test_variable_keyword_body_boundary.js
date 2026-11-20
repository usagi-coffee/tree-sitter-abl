import { RuleTester } from "oxlint/plugins-dev";
import { variableKeywordBodyBoundary } from "../oxlint/index.js";

const id = "variable-keyword-body-boundary";
const suppression = `// oxlint-disable-next-line rule-to-test/${id}`;
const keyword = 'kw("VARIABLE", { offset: 3 })';
const modifier = "optional($.__variable_modifier)";
const body = "$.__variable_body";
const prefix = `seq($._kw_define, ${modifier}, ${keyword}, ${body})`;
const type =
  'choice(seq($._kw_as, $._class_type), seq($._kw_like, field("like", $._identifier_or_array_access)))';
const declaration = `seq(field("name", $.identifier), optional($.__variable_extents), optional(alias($._kw_no_undo, $.no_undo)), ${type}, optional($.__variable_options))`;
const rules = `
  variable_definition: ($) => seq($.__variable_prefix, $._terminator),
  __variable_prefix: ($) => ${prefix},
  __variable_body: ($) => ${declaration},
  __variable_modifier: ($) => $._member_access_modifier,
  __variable_extents: ($) => $._extent_phrase,
  __variable_options: ($) => $.view_as_phrase,
`;
const before = `export default ({ kw }) => ({${rules}});`;
const after = before
  .replace(`${keyword}, ${body}`, body)
  .replace(declaration, declaration.replace("seq(", `seq(${keyword}, `));
const message = /moving the VARIABLE keyword into the retained declaration body/;

new RuleTester().run(id, variableKeywordBodyBoundary, {
  valid: [
    after,
    before.replace(keyword, 'kw("VARIABLE")'),
    before.replace(keyword, 'kw("VARIABLE", { offset: 4 })'),
    before.replace(keyword, 'kw("VARIABLE", { offset: 3, alias: "VAR" })'),
    before.replace(keyword, 'kw("VARIABLE", settings)'),
    before.replace(modifier, "$.__variable_modifier"),
    before.replace(`${keyword}, ${body}`, `${keyword}, alias(${body}, $.body)`),
    before.replace("$._terminator", "$._no_error_terminator"),
    before.replace('field("name", $.identifier)', 'field("name", $._qualified_identifier)'),
    before.replace(type, "seq($._kw_as, $._class_type)"),
    before.replace("optional($.__variable_extents)", "$.__variable_extents"),
    before.replace("optional($.__variable_options)", "optional($.__other_options)"),
    before.replace("__variable_modifier:", "__other_modifier:"),
    before.replace("__variable_prefix:", '["__variable_prefix"]:'),
    before.replace("=> ({", "=> ({ ...rules,"),
    before.replace("\n});", `\n  other: ($) => ${body},\n});`),
    before.replace("\n});", "\n  other: ($) => $[name],\n});"),
    before.replace("__variable_prefix:", `${suppression}\n  __variable_prefix:`),
    before.replace(keyword, `\n    ${suppression}\n    ${keyword}`),
    {
      filename: "grammar.js",
      code: `export default grammar({ inline: ($) => [${body}], rules: {${rules}} });`,
    },
  ],
  invalid: [
    { code: before, errors: [{ message }] },
    { code: before.replaceAll("__variable_", "__declaration_"), errors: [{ message }] },
  ],
});
