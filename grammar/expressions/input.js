export default ({ kw }) => ({
  input_expression: ($) =>
    seq(
      $.__input_expression_prefix,
      optional($.__input_widget_phrase),
      field("field", $.__input_field),
    ),
  __input_expression_prefix: ($) => kw("INPUT"),
  __input_widget_phrase: ($) =>
    choice(
      seq(kw("FRAME", { offset: 4 }), field("frame", $.identifier)),
      seq(kw("BROWSE"), field("browse", $.identifier)),
    ),
  __input_field: ($) => choice($._identifier_or_qualified_name, $.object_access, $.array_access),
});
