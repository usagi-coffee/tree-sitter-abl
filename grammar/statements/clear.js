module.exports = ({ kw }) => ({
  clear_statement: ($) => seq($.__clear_prefix, $._terminator),
  __clear_prefix: ($) =>
    seq(
      kw("CLEAR"),
      optional(
        choice(
          seq(kw("FRAME"), field("frame", $.identifier), optional($.__clear_all_no_pause_tail)),
          $.__clear_all_no_pause_tail,
        ),
      ),
    ),
  __clear_all_no_pause_tail: ($) =>
    choice(
      seq(alias(kw("ALL"), $.all), optional(alias(kw("NO-PAUSE"), $.no_pause))),
      alias(kw("NO-PAUSE"), $.no_pause),
    ),
});
