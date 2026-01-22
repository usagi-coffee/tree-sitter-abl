module.exports = ({ kw, tkw }) => ({
  scroll_statement: ($) =>
    seq(
      tkw("SCROLL"),
      optional(tkw("FROM-CURRENT")),
      optional(choice(tkw("UP"), tkw("DOWN"))),
      optional(alias($.__scroll_frame_phrase, $.frame_phrase)),
      $._terminator,
    ),
  __scroll_frame_phrase: ($) =>
    seq(kw("WITH"), kw("FRAME"), field("frame", $.identifier)),
});
