module.exports = ({ kw }) => ({
  export_statement: ($) =>
    seq(
      kw("EXPORT"),
      optional($._stream_phrase),
      optional(choice($.__export_expressions_body, $._expression)),
      $._terminator,
    ),

  __export_expressions_body: ($) =>
    seq(
      optional(alias($.__export_delimiter_phrase, $.delimiter_phrase)),
      repeat1($.__export_expression),
      optional(
        seq(kw("EXCEPT"), $.__export_field_name, repeat($.__export_field_name)),
      ),
      optional(alias(kw("NO-LOBS"), $.no_lobs)),
    ),

  __export_expression: ($) => $._expression,

  __export_field_name: ($) => $._identifier_or_qualified_name,
  __export_delimiter_phrase: ($) =>
    seq(kw("DELIMITER"), field("delimiter", $.string_literal)),
});
