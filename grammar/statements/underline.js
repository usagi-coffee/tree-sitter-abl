module.exports = ({ kw }) => ({
  underline_statement: ($) =>
    seq(kw("UNDERLINE"), $.__underline_body, $._terminator),

  __underline_body: ($) =>
    seq(
      optional($.__underline_stream),
      repeat1(field("field", $._expression)),
      optional($.frame_phrase),
    ),

  __underline_stream: ($) =>
    seq(
      choice(kw("STREAM"), kw("STREAM-HANDLE")),
      field("stream", $.identifier),
    ),
});
