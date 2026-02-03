module.exports = ({ kw }) => ({
  page_statement: ($) =>
    seq(kw("PAGE"), optional($.__page_stream), $._terminator),

  __page_stream: ($) => $._stream_phrase,
});
