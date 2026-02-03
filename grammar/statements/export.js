module.exports = ({ kw }) => ({
  export_statement: ($) =>
    seq(
      kw("EXPORT"),
      optional($.__export_stream),
      optional(choice($.__export_expressions_body, $._expression)),
      $._terminator,
    ),

  __export_stream: ($) =>
    seq(
      choice(kw("STREAM"), kw("STREAM-HANDLE")),
      field("stream", $.identifier),
    ),

  __export_expressions_body: ($) =>
    seq(
      optional(alias($.__export_delimiter_phrase, $.delimiter_phrase)),
      repeat1($.__export_expression),
      optional(
        seq(kw("EXCEPT"), $.__export_field_name, repeat($.__export_field_name)),
      ),
      optional(alias($.__export_no_lobs, $.no_lobs)),
    ),

  __export_expression: ($) => $._expression,

  __export_field_name: ($) => $._identifier_or_qualified_name,
  __export_delimiter_phrase: ($) => seq(kw("DELIMITER"), $.string_literal),
  __export_no_lobs: ($) => kw("NO-LOBS"),
});
