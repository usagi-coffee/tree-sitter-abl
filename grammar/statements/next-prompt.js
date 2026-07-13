export default ({ kw }) => ({
  next_prompt_statement: ($) => seq($.__next_prompt_prefix, $._terminator),

  __next_prompt_prefix: ($) =>
    seq(
      kw("NEXT-PROMPT"),
      field("field", $._identifier_or_qualified_name),
      optional($.frame_phrase),
    ),
});
