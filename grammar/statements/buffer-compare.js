export default ({ kw }) => ({
  buffer_compare_statement: ($) => seq($.__buffer_compare_prefix, $._no_error_terminator),

  __buffer_compare_prefix: ($) =>
    seq(
      kw("BUFFER-COMPARE"),
      field("source", $._expression),
      optional($.__buffer_compare_field_phrase),
      $._to_keyword,
      field("target", $._expression),
      optional($.__buffer_compare_tail),
    ),

  __buffer_compare_tail: ($) =>
    choice(
      seq(
        choice(alias(kw("CASE-SENSITIVE"), $.case_sensitive), alias(kw("BINARY"), $.binary)),
        optional($.__buffer_compare_after_mode),
      ),
      $.__buffer_compare_after_mode,
    ),
  __buffer_compare_after_mode: ($) =>
    choice(
      seq(
        alias($.__buffer_compare_save_phrase, $.save_phrase),
        optional($.__buffer_compare_after_save),
      ),
      $.__buffer_compare_after_save,
    ),
  __buffer_compare_after_save: ($) =>
    choice(
      seq(
        alias($.__buffer_compare_compares_block, $.compares_block),
        optional(alias(kw("NO-LOBS"), $.no_lobs)),
      ),
      alias(kw("NO-LOBS"), $.no_lobs),
    ),

  __buffer_compare_field_phrase: ($) =>
    seq(
      choice(kw("EXCEPT"), kw("USING")),
      repeat1(field("field", $._identifier_or_qualified_name)),
    ),

  __buffer_compare_save_phrase: ($) =>
    seq(kw("SAVE"), optional(seq(kw("RESULT"), kw("IN"))), field("result", $._expression)),

  __buffer_compare_compares_block: ($) =>
    seq(
      optional(alias(kw("EXPLICIT"), $.explicit)),
      $.__buffer_compare_compares,
      alias($._colon, ":"),
      repeat1($.__buffer_compare_when_phrase),
      optional($.__buffer_compare_compares),
      kw("END"),
    ),
  __buffer_compare_compares: ($) => alias(kw("COMPARES"), $.compares),

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
