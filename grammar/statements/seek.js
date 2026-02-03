module.exports = ({ kw }) => ({
  seek_statement: ($) =>
    prec.right(seq(kw("SEEK"), $.__seek_body, $._terminator)),

  __seek_body: ($) =>
    seq(
      choice(kw("INPUT"), kw("OUTPUT"), $._stream_phrase),
      kw("TO"),
      choice(kw("END"), $._expression),
    ),

  // SEEK expression: SEEK(INPUT) or SEEK(OUTPUT) or SEEK(name) or SEEK(STREAM-HANDLE handle) - returns current stream position
  seek_expression: ($) =>
    seq(
      field("function", alias(kw("SEEK"), $.identifier)),
      "(",
      field(
        "value",
        choice(
          kw("INPUT"),
          kw("OUTPUT"),
          field("name", $.identifier),
          seq(
            kw("STREAM-HANDLE"),
            field("handle", $._identifier_or_qualified_name),
          ),
        ),
      ),
      ")",
    ),
});
