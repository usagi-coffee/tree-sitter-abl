export default ({ kw }) => ({
  export_statement: ($) => seq($.__export_statement_body, $._terminator),
  __export_statement_body: ($) =>
    seq($.__export_statement_head, optional($.__export_expressions_body)),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __export_statement_head: ($) => seq(kw("EXPORT"), optional($._stream_phrase)),

  __export_expressions_body: ($) =>
    seq(optional($.delimiter_phrase), $._expression_list, optional($.__export_tail)),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __export_tail: ($) =>
    choice(
      seq($.__export_except_phrase, optional(alias(kw("NO-LOBS"), $.no_lobs))),
      alias(kw("NO-LOBS"), $.no_lobs),
    ),
  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __export_except_phrase: ($) => seq($._kw_except, $._import_export_except_names),
});
