module.exports = ({ kw, tkw }) => ({
  scroll_statement: ($) =>
    seq(
      tkw("SCROLL"),
      optional(tkw("FROM-CURRENT")),
      optional(choice(tkw("UP"), tkw("DOWN"))),
      optional($.frame_phrase),
      $._terminator,
    ),
});
