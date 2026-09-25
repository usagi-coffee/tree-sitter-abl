export default ({ kw }) => ({
  seek_statement: ($) => prec.right(seq($.__seek_prefix, $._terminator)),

  __seek_prefix: ($) =>
    seq($._kw_seek, $.__seek_stream, $._kw_to, choice($._end_keyword, $._expression)),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __seek_stream: ($) => choice($._kw_input, $._kw_output, $._stream_phrase),

  seek_expression: ($) => seq($.__seek_expression_body, ")"),

  __seek_expression_body: ($) =>
    seq(
      field("function", alias($._kw_seek, $.identifier)),
      "(",
      choice(
        $._kw_input,
        $._kw_output,
        field("name", $.identifier),
        seq($._kw_stream_handle, field("handle", $._qualified_identifier)),
      ),
    ),
});
