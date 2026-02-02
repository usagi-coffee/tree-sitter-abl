module.exports = ({ kw }) => ({
  export_statement: ($) => seq(kw("EXPORT"), $.__export_body, $._terminator),

  __export_body: ($) =>
    seq(
      optional($.__export_stream),
      $.__export_fields_phrase,
      optional(alias($.__export_no_lobs, $.no_lobs)),
    ),

  __export_stream: ($) =>
    seq(
      choice(kw("STREAM"), kw("STREAM-HANDLE")),
      field("stream", $.identifier),
    ),

  __export_fields_phrase: ($) =>
    seq(
      optional(alias($.__export_delimiter_phrase, $.delimiter_phrase)),
      repeat1($._expression),
      optional(
        seq(kw("EXCEPT"), $.__export_field_name, repeat($.__export_field_name)),
      ),
    ),
  __export_field_name: ($) => choice($.identifier, $.qualified_name),
  __export_delimiter_phrase: ($) => seq(kw("DELIMITER"), $.string_literal),
  __export_no_lobs: ($) => kw("NO-LOBS"),
});
