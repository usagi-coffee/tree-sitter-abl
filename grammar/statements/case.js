export default ({ kw }) => ({
  case_statement: ($) => seq($.__case_prefix, $._terminator),

  __case_prefix: ($) =>
    seq(
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      kw("CASE"),
      $._expression,
      alias($._colon, ":"),
      optional($.__case_items),
      optional($.case_otherwise_phrase),
      $._end_keyword,
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      optional(kw("CASE")),
    ),

  __case_items: ($) =>
    prec.right(
      seq(
        // oxlint-disable-next-line tree-sitter-optimize/shared-statement-alias
        choice($.case_when_phrase, $.include_file_reference),
        optional($.__case_items),
      ),
    ),

  case_when_phrase: ($) =>
    seq($._kw_when, field("condition", $.__case_when_expression_list), kw("THEN"), $._statement),

  case_otherwise_phrase: ($) => seq(kw("OTHERWISE"), $._statement),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-field-sequence
  __case_when_expression_list: ($) =>
    seq($._expression, optional($.__case_when_expression_list_tail)),
  __case_when_expression_list_tail: ($) =>
    seq(
      $._kw_or,
      $._kw_when,
      field("condition", $._expression),
      optional($.__case_when_expression_list_tail),
    ),
});
