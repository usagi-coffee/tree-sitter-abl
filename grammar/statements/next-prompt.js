export default ({ kw }) => ({
  next_prompt_statement: ($) => seq($.__next_prompt_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __next_prompt_prefix: ($) =>
    seq(kw("NEXT-PROMPT"), field("field", $._qualified_identifier), optional($.frame_phrase)),
});
