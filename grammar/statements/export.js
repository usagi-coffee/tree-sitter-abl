export default ({ kw }) => ({
  export_statement: ($) => seq($.__export_statement_body, $._terminator),
  __export_statement_body: ($) =>
    seq($.__export_statement_head, optional($.__export_expressions_body)),
  __export_statement_head: ($) => seq(kw("EXPORT"), optional($._stream_phrase)),

  __export_expressions_body: ($) =>
    seq(optional($.delimiter_phrase), $.__export_expressions, optional($.__export_tail)),
  __export_expressions: ($) =>
    prec.right(seq($.__export_expression, optional($.__export_expressions))),
  __export_tail: ($) =>
    choice(
      seq($.__export_except_phrase, optional(alias(kw("NO-LOBS"), $.no_lobs))),
      alias(kw("NO-LOBS"), $.no_lobs),
    ),
  __export_expression: ($) => $._expression,
  __export_except_phrase: ($) => seq(kw("EXCEPT"), $._import_export_except_names),
});
