module.exports = ({ kw }) => ({
  scroll_statement: ($) =>
    seq(
      kw("SCROLL"),
      optional(kw("FROM-CURRENT")),
      optional(choice(kw("UP"), kw("DOWN"))),
      optional($.frame_phrase),
      $._terminator,
    ),
});
