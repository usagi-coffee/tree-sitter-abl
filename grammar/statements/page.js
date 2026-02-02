module.exports = ({ kw }) => ({
  page_statement: ($) =>
    seq(kw("PAGE"), optional($.__page_stream), $._terminator),

  __page_stream: ($) =>
    seq(
      choice(kw("STREAM"), kw("STREAM-HANDLE")),
      field("stream", $.identifier),
    ),
});
