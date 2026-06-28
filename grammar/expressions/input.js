module.exports = ({ kw }) => ({
  input_expression: ($) =>
    seq(
      kw("INPUT"),
      optional($.__input_frame_phrase),
      field("field", choice($._identifier_or_qualified_name, $.object_access, $.array_access)),
    ),
  __input_frame_phrase: ($) => seq(kw("FRAME"), field("frame", $.identifier)),
});
