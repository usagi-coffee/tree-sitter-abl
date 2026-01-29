module.exports = ({ kw, tkw }) => ({
  export_statement: ($) => seq(kw("EXPORT"), $.__export_body, $._terminator),

  __export_body: ($) =>
    seq(
      optional(
        choice(
          alias($.__export_stream_phrase, $.stream_phrase),
          alias($.__export_stream_handle_phrase, $.stream_handle_phrase),
        ),
      ),
      $.__export_fields_phrase,
      optional(alias($.__export_no_lobs, $.no_lobs)),
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
  __export_stream_phrase: ($) => seq(kw("STREAM"), field("name", $.identifier)),
  __export_stream_handle_phrase: ($) =>
    seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
  __export_delimiter_phrase: ($) => seq(kw("DELIMITER"), $.string_literal),
  __export_no_lobs: ($) => tkw("NO-LOBS"),
});
