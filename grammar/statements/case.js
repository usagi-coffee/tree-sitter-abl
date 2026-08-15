export default ({ kw }) => ({
  case_statement: ($) => seq($.__case_prefix, $._terminator),

  __case_prefix: ($) =>
    seq(
      kw("CASE"),
      $._expression,
      alias($._colon, ":"),
      // The syntax box asks for at least one WHEN, but generated code writes a
      // CASE whose only branch is OTHERWISE, and sometimes one with no branch
      // at all where the branches came from a macro that expanded to nothing.
      repeat(choice($.case_when_phrase, alias($.include_statement, $.include_file_reference))),
      optional($.case_otherwise_phrase),
      kw("END"),
      optional(kw("CASE")),
    ),

  case_when_phrase: ($) =>
    seq(kw("WHEN"), field("condition", $.__case_when_expression_list), kw("THEN"), $._statement),

  case_otherwise_phrase: ($) => seq(kw("OTHERWISE"), $._statement),

  __case_when_expression_list: ($) =>
    seq($._expression, optional($.__case_when_expression_list_tail)),
  __case_when_expression_list_tail: ($) =>
    repeat1(seq(kw("OR"), kw("WHEN"), field("condition", $._expression))),
});
