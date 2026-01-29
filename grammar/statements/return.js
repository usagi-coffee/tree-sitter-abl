module.exports = ({ kw, tkw }) => ({
  return_statement: ($) =>
    seq(
      tkw("RETURN"),
      optional(
        choice(
          $._expression,
          seq(tkw("ERROR"), optional($._expression)),
          tkw("NO-APPLY"),
        ),
      ),
      $._terminator,
    ),
});
