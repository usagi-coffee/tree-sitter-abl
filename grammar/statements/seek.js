export default ({ kw }) => ({
  seek_statement: ($) => prec.right(seq($.__seek_prefix, $._terminator)),

  __seek_prefix: ($) =>
    seq(kw("SEEK"), $.__seek_stream, $._to_keyword, choice($._end_keyword, $._expression)),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __seek_stream: ($) => choice($._kw_input, kw("OUTPUT"), $._stream_phrase),

  seek_expression: ($) => seq($.__seek_expression_body, ")"),

  __seek_expression_body: ($) =>
    seq(
      field("function", alias(kw("SEEK"), $.identifier)),
      "(",
      choice(
        $._kw_input,
        kw("OUTPUT"),
        field("name", $.identifier),
        seq(kw("STREAM-HANDLE"), field("handle", $._identifier_or_qualified_name)),
      ),
    ),
});
