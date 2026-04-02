module.exports = ({ kw }) => ({
  scroll_statement: ($) => seq(kw("SCROLL"), optional($.__scroll_tail), $._terminator),
  __scroll_tail: ($) =>
    choice(
      seq(alias(kw("FROM-CURRENT"), $.from_current), optional($.__scroll_tail_after_from_current)),
      seq($.__scroll_direction, optional($.frame_phrase)),
      $.frame_phrase,
    ),
  __scroll_tail_after_from_current: ($) =>
    choice(seq($.__scroll_direction, optional($.frame_phrase)), $.frame_phrase),
  __scroll_direction: ($) => choice(alias(kw("UP"), $.up), alias(kw("DOWN"), $.down)),
});
