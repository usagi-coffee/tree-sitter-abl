export default ({ kw }) => ({
  seek_statement: ($) => prec.right(seq($.__seek_prefix, $._terminator)),

  __seek_prefix: ($) =>
    seq(
      kw("SEEK"),
      choice(kw("INPUT"), kw("OUTPUT"), $._stream_phrase),
      kw("TO"),
      choice(kw("END"), $._expression),
    ),

  seek_expression: ($) =>
    seq($.__seek_expression_prefix, $.__seek_expression_opener, $.__seek_value, ")"),

  __seek_expression_prefix: ($) => field("function", alias(kw("SEEK"), $.identifier)),
  __seek_expression_opener: ($) => "(",

  __seek_value: ($) =>
    choice(
      kw("INPUT"),
      kw("OUTPUT"),
      field("name", $.identifier),
      seq(kw("STREAM-HANDLE"), field("handle", $._identifier_or_qualified_name)),
    ),
});
