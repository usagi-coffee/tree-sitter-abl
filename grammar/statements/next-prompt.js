module.exports = ({ kw, tkw }) => ({
  next_prompt_statement: ($) =>
    seq(
      tkw("NEXT-PROMPT"),
      field("field", $._expression),
      optional(alias($.__next_prompt_frame_phrase, $.frame_phrase)),
      $._terminator,
    ),
  __next_prompt_frame_phrase: ($) =>
    seq(kw("WITH"), kw("FRAME"), field("frame", $.identifier)),
});
