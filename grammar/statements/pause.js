module.exports = ({ kw }) => ({
  pause_statement: ($) =>
    seq(
      token(/PAUSE/i),
      optional(field("duration", $._expression)),
      optional(token(/BEFORE-HIDE/i)),
      optional(
        choice(
          seq(kw("MESSAGE"), field("message", $.string_literal)),
          token(/NO-MESSAGE/i),
        ),
      ),
      optional(seq(kw("IN"), kw("WINDOW"), field("window", $._expression))),
      $._terminator,
    ),
});
