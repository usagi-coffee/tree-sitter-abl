export default ({ kw }) => ({
  status_statement: ($) => seq($.__status_prefix, $._terminator),

  __status_prefix: ($) =>
    seq(
      kw("STATUS"),
      choice(
        seq($._kw_default, optional(field("message", $._expression))),
        seq($._kw_input, optional(choice(kw("OFF"), field("message", $._expression)))),
      ),
      optional($.in_window_phrase),
    ),
});
