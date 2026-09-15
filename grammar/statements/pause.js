export default ({ kw }) => ({
  pause_statement: ($) => seq($.__pause_prefix, $._terminator),
  __pause_prefix: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      kw("PAUSE"),
      optional(field("duration", $._expression)),
      optional(alias(kw("BEFORE-HIDE"), $.before_hide)),
      optional($.__pause_message_window_tail),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __pause_message_window_tail: ($) =>
    choice(seq($.__pause_message, optional($.in_window_phrase)), $.in_window_phrase),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __pause_message: ($) =>
    choice(
      seq(kw("MESSAGE"), field("message", $.string_literal)),
      alias(kw("NO-MESSAGE"), $.no_message),
    ),
});
