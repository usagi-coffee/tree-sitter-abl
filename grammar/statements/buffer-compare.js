module.exports = ({ kw }) => ({
  buffer_compare_statement: ($) =>
    seq(kw("BUFFER-COMPARE"), $.__buffer_compare_body, $._terminator),

  __buffer_compare_body: ($) =>
    seq(
      field("source", $._expression),
      optional($.__buffer_compare_field_phrase),
      kw("TO"),
      field("target", $._expression),
      optional(choice(kw("CASE-SENSITIVE"), kw("BINARY"))),
      optional(alias($.__buffer_compare_save_phrase, $.save_phrase)),
      optional(alias($.__buffer_compare_compares_block, $.compares_block)),
      optional(kw("NO-LOBS")),
      optional(kw("NO-ERROR")),
    ),

  __buffer_compare_field_phrase: ($) =>
    seq(
      choice(kw("EXCEPT"), kw("USING")),
      repeat1(field("field", choice($.identifier, $.qualified_name))),
    ),

  __buffer_compare_save_phrase: ($) =>
    seq(
      kw("SAVE"),
      optional(seq(kw("RESULT"), kw("IN"))),
      field("result", $._expression),
    ),

  __buffer_compare_compares_block: ($) =>
    seq(
      optional(kw("EXPLICIT")),
      kw("COMPARES"),
      $._colon,
      repeat1($.__buffer_compare_when_phrase),
      optional(kw("COMPARES")),
      kw("END"),
    ),

  __buffer_compare_when_phrase: ($) =>
    seq(
      kw("WHEN"),
      field("field", $._primary_expression),
      field("operator", $._comparison_operator),
      field("value", $._primary_expression),
      kw("THEN"),
      field("action", $._statement),
    ),
});
