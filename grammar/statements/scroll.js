module.exports = ({ kw }) => ({
  scroll_statement: ($) =>
    seq(
      kw("SCROLL"),
      optional(alias(kw("FROM-CURRENT"), $.from_current)),
      optional(choice(alias(kw("UP"), $.up), alias(kw("DOWN"), $.down))),
      optional($.frame_phrase),
      $._terminator,
    ),
});
