module.exports = ({ kw, tkw }) => ({
  pause_statement: ($) =>
    seq(
      tkw("PAUSE"),
      optional(field("duration", $._expression)),
      optional(tkw("BEFORE-HIDE")),
      optional(
        choice(
          seq(kw("MESSAGE"), field("message", $.string_literal)),
          tkw("NO-MESSAGE"),
        ),
      ),
      optional(seq(kw("IN"), kw("WINDOW"), field("window", $._expression))),
      $._terminator,
    ),
});
