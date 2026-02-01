module.exports = ({ kw }) => ({
  pause_statement: ($) =>
    seq(
      kw("PAUSE"),
      optional(field("duration", $._expression)),
      optional(kw("BEFORE-HIDE")),
      optional(
        choice(
          seq(kw("MESSAGE"), field("message", $.string_literal)),
          kw("NO-MESSAGE"),
        ),
      ),
      optional(seq(kw("IN"), kw("WINDOW"), field("window", $._expression))),
      $._terminator,
    ),
});
