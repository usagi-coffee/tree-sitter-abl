export default ({ kw }) => ({
  buffer_copy_statement: ($) => seq($.__buffer_copy_prefix, $._no_error_terminator),

  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __buffer_copy_prefix: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      kw("BUFFER-COPY"),
      field("source", $._identifier_or_qualified_name),
      optional(
        choice(
          alias($.__buffer_copy_except_phrase, $.except_phrase),
          alias($.__buffer_copy_using_phrase, $.using_phrase),
        ),
      ),
      $._to_keyword,
      field("target", $._identifier_or_qualified_name),
      optional(alias($.__buffer_copy_assign_phrase, $.assign_phrase)),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      optional(alias(kw("NO-LOBS"), $.no_lobs)),
    ),
  __buffer_copy_except_phrase: ($) => seq($._kw_except, $._field_names),
  __buffer_copy_using_phrase: ($) => seq($._using_keyword, $._field_names),
  __buffer_copy_assign_phrase: ($) => seq($._kw_assign, $.__buffer_copy_assign_pairs),
  __buffer_copy_assign_pair: ($) =>
    seq(
      field("left", $._assignable),
      // oxlint-disable-next-line tree-sitter-optimize/choice-subset, tree-sitter-optimize/shared-choice
      choice("=", "+=", "-=", "*=", "/="),
      field("right", $._expression),
      // oxlint-disable-next-line tree-sitter-optimize/shared-sequence
      optional(seq($._kw_when, field("when", $._expression))),
    ),
  __buffer_copy_assign_pairs: ($) =>
    prec.right(
      seq(
        alias($.__buffer_copy_assign_pair, $.assign_pair),
        optional($.__buffer_copy_assign_pairs),
      ),
    ),
});
