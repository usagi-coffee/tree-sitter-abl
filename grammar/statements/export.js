module.exports = ({ kw }) => ({
  export_statement: ($) =>
    seq(
      kw("EXPORT"),
      optional($._stream_phrase),
      optional($.__export_expressions_body),
      $._terminator,
    ),

  __export_expressions_body: ($) =>
    seq(
      optional(alias($.__export_delimiter_phrase, $.delimiter_phrase)),
      repeat1($.__export_expression),
      optional($.__export_tail),
    ),
  __export_tail: ($) =>
    choice(
      seq($.__export_except_phrase, optional(alias(kw("NO-LOBS"), $.no_lobs))),
      alias(kw("NO-LOBS"), $.no_lobs),
    ),
  __export_expression: ($) => $._expression,
  __export_except_phrase: ($) => seq(kw("EXCEPT"), repeat1($._identifier_or_qualified_name)),
  __export_delimiter_phrase: ($) => seq(kw("DELIMITER"), field("delimiter", $.string_literal)),
});
