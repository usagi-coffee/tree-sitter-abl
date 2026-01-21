module.exports = ({ kw, tkw }) => ({
  seek_statement: ($) =>
    prec.right(
      seq(
        kw("SEEK"),
        choice(
          kw("INPUT"),
          kw("OUTPUT"),
          seq(kw("STREAM"), field("name", $.identifier)),
          seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
        ),
        kw("TO"),
        choice(tkw("END"), $._expression),
        $._terminator,
      ),
    ),
});
