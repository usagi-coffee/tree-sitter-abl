module.exports = ({ kw }) => ({
  input_expression: ($) =>
    seq(kw("INPUT"), optional($.__input_frame_phrase), field("field", $.__input_field)),
  __input_frame_phrase: ($) => seq(kw("FRAME"), field("frame", $.identifier)),
  __input_field: ($) => choice($._identifier_or_qualified_name, $.object_access, $.array_access),
});
