import { RuleTester } from "oxlint/plugins-dev";
import { optionalNumericPairExtraction } from "../oxlint/index.js";

const first = 'kw("MAX-VALUE"), field("max", $.number_literal)';
const second = 'kw("MIN-VALUE"), field("min", $.number_literal)';
const forward = `seq(${first}, ${second})`;
const reverse = `seq(${second}, ${first})`;
const choice = `choice(${forward}, ${reverse})`;
const bounds = `optional(${choice})`;
const tail = "optional($.__slider_after_orientation)";
const fixture = `export default ({ kw }) => ({
  slider_phrase: ($) => seq(
    $._kw_slider,
    ${bounds},
    optional(choice($._kw_horizontal, $._kw_vertical)),
    ${tail},
  ),
});`;
const suppress = "// oxlint-disable-next-line rule-to-test/optional-numeric-pair-extraction";
const message = /required keyword and numeric-field pairs in either order.*hidden rule.*call site/;

new RuleTester().run("optional-numeric-pair-extraction", optionalNumericPairExtraction, {
  valid: [
    fixture
      .replace(bounds, "optional($.__slider_range)")
      .replace("\n});", `\n  __slider_range: ($) => ${choice},\n});`),
    fixture.replace(bounds, choice),
    fixture.replace(bounds, `field("bounds", ${bounds})`),
    fixture.replace(bounds, `prec.dynamic(1, ${bounds})`),
    fixture.replace(bounds, `alias(${bounds}, $.bounds)`),
    fixture.replace(bounds, `token(${bounds})`),
    fixture.replace(bounds, `optional(choice(${forward}, ${forward}))`),
    fixture.replace(bounds, `optional(choice(${forward}, ${reverse}, $.third))`),
    fixture.replace(reverse, reverse.replace('field("max"', 'field("different"')),
    fixture.replaceAll('field("max"', 'field("min"'),
    fixture.replaceAll('kw("MAX-VALUE")', 'kw("MIN-VALUE")'),
    fixture.replaceAll('kw("MAX-VALUE")', 'kw("MAX-VALUE", { offset: 3 })'),
    fixture.replaceAll('kw("MAX-VALUE")', "kw(keyword)"),
    fixture.replaceAll("$.number_literal", "$._expression"),
    fixture.replaceAll(
      'field("max", $.number_literal)',
      'optional(field("max", $.number_literal))',
    ),
    fixture.replace("$._kw_slider", "$.identifier"),
    fixture.replace("slider_phrase", "slider_statement"),
    fixture.replace("slider_phrase", "__slider_phrase"),
    fixture.replace(tail, "$.required_suffix"),
    fixture.replace("slider_phrase:", `${suppress}\n  slider_phrase:`),
    fixture.replace(bounds, `${suppress}\n    ${bounds}`),
    fixture.replace(reverse, `\n    ${suppress}\n    ${reverse}`),
    {
      code: fixture
        .replace(
          "export default ({ kw }) => ({",
          "export default grammar({ inline: ($) => [$.slider_phrase], rules: {",
        )
        .replace("\n});", "\n} });"),
      filename: "grammar.js",
    },
  ],
  invalid: [
    { code: fixture, errors: [{ message }] },
    {
      code: fixture
        .replace("slider_phrase", "meter_phrase")
        .replace("$._kw_slider", 'kw("METER")')
        .replaceAll("MAX-VALUE", "LOWER")
        .replaceAll("MIN-VALUE", "UPPER"),
      errors: [{ message }],
    },
  ],
});
