export default ({ kw }) => ({
  underline_statement: ($) => seq($.__underline_prefix, $.__underline_body, $._terminator),

  __underline_prefix: ($) => seq(kw("UNDERLINE"), optional($._stream_phrase)),
  __underline_body: ($) =>
    seq(repeat1(field("field", $.__underline_field)), optional($.frame_phrase)),

  __underline_field: ($) => $._expression,
});
