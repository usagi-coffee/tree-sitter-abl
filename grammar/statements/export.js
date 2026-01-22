module.exports = ({ kw, tkw }) => ({
  export_statement: ($) =>
    seq(
      kw("EXPORT"),
      optional(
        choice(
          alias($.__export_stream_clause, $.stream_clause),
          alias($.__export_stream_handle_clause, $.stream_handle_clause),
        ),
      ),
      $.__export_fields_clause,
      optional(alias($.__export_no_lobs, $.no_lobs)),
      $._terminator,
    ),

  __export_fields_clause: ($) =>
    seq(
      optional(alias($.__export_delimiter_clause, $.delimiter_clause)),
      repeat1($._expression),
      optional(
        seq(
          kw("EXCEPT"),
          $.__export_field_name,
          repeat($.__export_field_name),
        ),
      ),
    ),
  __export_field_name: ($) => choice($.identifier, $.qualified_name),
  __export_stream_clause: ($) => seq(kw("STREAM"), field("name", $.identifier)),
  __export_stream_handle_clause: ($) =>
    seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
  __export_delimiter_clause: ($) => seq(kw("DELIMITER"), $.string_literal),
  __export_no_lobs: ($) => tkw("NO-LOBS"),
});
