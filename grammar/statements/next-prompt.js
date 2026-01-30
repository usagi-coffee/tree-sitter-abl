module.exports = ({ kw, tkw }) => ({
  next_prompt_statement: ($) =>
    seq(tkw("NEXT-PROMPT"), $.__next_prompt_body, $._terminator),

  __next_prompt_body: ($) =>
    seq(
      field("field", $._expression),
      optional($.frame_phrase),
    ),
});
