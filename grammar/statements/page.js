module.exports = ({ kw }) => ({
  page_statement: ($) =>
    seq(kw("PAGE"), optional($._stream_phrase), $._terminator),
});
