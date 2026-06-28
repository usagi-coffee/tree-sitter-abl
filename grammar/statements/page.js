module.exports = ({ kw }) => ({
  page_statement: ($) => seq($.__page_prefix, $._terminator),

  __page_prefix: ($) => seq(kw("PAGE"), optional($._stream_phrase)),
});
