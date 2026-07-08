module.exports = ({ kw }) => ({
  status_statement: ($) => seq($.__status_prefix, $._terminator),

  __status_prefix: ($) =>
    seq(
      kw("STATUS"),
      choice(
        seq(kw("DEFAULT"), optional(field("message", $._expression))),
        seq(kw("INPUT"), optional(choice(kw("OFF"), field("message", $._expression)))),
      ),
      optional($.in_window_phrase),
    ),
});
