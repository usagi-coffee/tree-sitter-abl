export default ({ kw }) => ({
  case_statement: ($) => seq($.__case_prefix, $._terminator),

  __case_prefix: ($) =>
    seq(
      kw("CASE"),
      $._expression,
      alias($._colon, ":"),
      repeat(choice($.case_when_phrase, alias($.include_statement, $.include_file_reference))),
      optional($.case_otherwise_phrase),
      $._end_keyword,
      optional(kw("CASE")),
    ),

  case_when_phrase: ($) =>
    seq(kw("WHEN"), field("condition", $.__case_when_expression_list), kw("THEN"), $._statement),

  case_otherwise_phrase: ($) => seq(kw("OTHERWISE"), $._statement),

  __case_when_expression_list: ($) =>
    seq($._expression, optional($.__case_when_expression_list_tail)),
  __case_when_expression_list_tail: ($) =>
    seq(
      kw("OR"),
      kw("WHEN"),
      field("condition", $._expression),
      optional($.__case_when_expression_list_tail),
    ),
});
