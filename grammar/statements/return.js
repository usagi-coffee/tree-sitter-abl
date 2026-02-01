module.exports = ({ kw }) => ({
  return_statement: ($) =>
    seq(
      kw("RETURN"),
      optional(
        choice(
          $._expression,
          seq(kw("ERROR"), optional($._expression)),
          kw("NO-APPLY"),
        ),
      ),
      $._terminator,
    ),
});
