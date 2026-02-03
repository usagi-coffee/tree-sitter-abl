module.exports = ({ kw }) => ({
  underline_statement: ($) =>
    seq(kw("UNDERLINE"), $.__underline_body, $._terminator),

  __underline_body: ($) =>
    seq(
      optional($._stream_phrase),
      repeat1(field("field", $.__underline_field)),
      optional($.frame_phrase),
    ),

  __underline_field: ($) => $._expression,

});
