export default ({ kw }) => ({
  underline_statement: ($) => seq($.__underline_statement_body, $._terminator),

  __underline_statement_body: ($) => seq($.__underline_prefix, $.__underline_body),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __underline_prefix: ($) => seq(kw("UNDERLINE"), optional($._stream_phrase)),
  __underline_body: ($) => seq($.__underline_fields, optional($.frame_phrase)),

  __underline_fields: ($) =>
    prec.right(seq(field("field", $._expression), optional($.__underline_fields))),
});
