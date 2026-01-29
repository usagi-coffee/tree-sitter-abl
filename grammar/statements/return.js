module.exports = ({ kw, tkw }) => ({
  return_statement: ($) =>
    seq(
      tkw("RETURN"),
      optional(
        choice(
          $._expression,
          seq(tkw("RETURN"), tkw("ERROR"), optional($._expression)),
        ),
      ),
      $._terminator,
    ),
});
