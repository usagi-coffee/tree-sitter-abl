module.exports = ({ kw }) => ({
  status_statement: ($) => seq(kw("STATUS"), $.__status_body, $._terminator),

  __status_body: ($) =>
    seq(
      choice(
        seq(kw("DEFAULT"), optional(field("message", $._expression))),
        seq(
          kw("INPUT"),
          optional(choice(kw("OFF"), field("message", $._expression))),
        ),
      ),
      optional($._in_window_phrase),
    ),
});
