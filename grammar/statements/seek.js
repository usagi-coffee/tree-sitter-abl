module.exports = ({ kw }) => ({
  seek_statement: ($) => prec.right(seq(kw("SEEK"), $.__seek_body, $._terminator)),

  __seek_body: ($) =>
    seq(
      choice(kw("INPUT"), kw("OUTPUT"), $._stream_phrase),
      kw("TO"),
      choice(kw("END"), $._expression),
    ),

  seek_expression: ($) =>
    seq(field("function", alias(kw("SEEK"), $.identifier)), "(", $.__seek_value, ")"),

  __seek_value: ($) =>
    choice(
      kw("INPUT"),
      kw("OUTPUT"),
      field("name", $.identifier),
      seq(kw("STREAM-HANDLE"), field("handle", $._identifier_or_qualified_name)),
    ),
});
