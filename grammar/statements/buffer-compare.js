module.exports = ({ kw, tkw }) => ({
  buffer_compare_statement: ($) =>
    seq(
      kw("BUFFER-COMPARE"),
      field("source", $._expression),
      optional($.__buffer_compare_field_clause),
      kw("TO"),
      field("target", $._expression),
      optional(choice(tkw("CASE-SENSITIVE"), tkw("BINARY"))),
      optional(alias($.__buffer_compare_save_clause, $.save_clause)),
      optional(alias($.__buffer_compare_compares_block, $.compares_block)),
      optional(tkw("NO-LOBS")),
      optional(tkw("NO-ERROR")),
      $._terminator,
    ),

  __buffer_compare_field_clause: ($) =>
    seq(
      choice(kw("EXCEPT"), kw("USING")),
      repeat1(field("field", choice($.identifier, $.qualified_name))),
    ),
  __buffer_compare_save_clause: ($) =>
    seq(
      kw("SAVE"),
      optional(seq(kw("RESULT"), kw("IN"))),
      field("result", $._expression),
    ),
  __buffer_compare_compares_block: ($) =>
    seq(
      optional(tkw("EXPLICIT")),
      tkw("COMPARES"),
      $._colon,
      repeat1($.__buffer_compare_when_clause),
      optional(tkw("COMPARES")),
      tkw("END"),
    ),
  __buffer_compare_when_clause: ($) =>
    seq(
      kw("WHEN"),
      field("field", $._primary_expression),
      field("operator", $.__buffer_compare_operator),
      field("value", $._primary_expression),
      kw("THEN"),
      field("action", $._statement),
    ),
  __buffer_compare_operator: ($) =>
    choice(
      alias("=", $.EQ),
      alias("<>", $.NE),
      alias(">", $.GT),
      alias("<", $.LT),
      alias(">=", $.GE),
      alias("<=", $.LE),
    ),
});
