module.exports = ({ kw }) => ({
  seek_statement: ($) =>
    prec.right(seq(kw("SEEK"), $.__seek_body, $._terminator)),

  __seek_body: ($) =>
    seq(
      choice(
        kw("INPUT"),
        kw("OUTPUT"),
        seq(kw("STREAM"), field("name", $.identifier)),
        seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
      ),
      kw("TO"),
      choice(kw("END"), $._expression),
    ),
});
