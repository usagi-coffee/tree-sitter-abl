export default ({ kw }) => ({
  input_expression: ($) =>
    seq(
      $.__input_expression_prefix,
      optional($.__input_frame_phrase),
      field("field", $.__input_field),
    ),
  __input_expression_prefix: ($) => kw("INPUT"),
  __input_frame_phrase: ($) => seq(kw("FRAME"), field("frame", $.identifier)),
  __input_field: ($) => choice($._identifier_or_qualified_name, $.object_access, $.array_access),
});
