module.exports = ({ kw }) => ({
  next_prompt_statement: ($) =>
    seq(kw("NEXT-PROMPT"), $.__next_prompt_body, $._terminator),

  __next_prompt_body: ($) =>
    seq(field("field", $._identifier_or_qualified_name), optional($.frame_phrase)),
});
