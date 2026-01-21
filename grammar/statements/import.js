module.exports = ({ kw }) => ({
  import_statement: ($) =>
    seq(
      kw("IMPORT"),
      optional(
        choice(
          alias($.__import_stream_clause, $.stream_clause),
          alias($.__import_stream_handle_clause, $.stream_handle_clause),
        ),
      ),
      choice(
        $.__import_fields_clause,
        alias($.__import_unformatted_clause, $.unformatted_clause),
      ),
      optional(alias($.__import_no_lobs, $.no_lobs)),
      optional(alias($.__import_no_error, $.no_error)),
      $._terminator,
    ),

  __import_stream_clause: ($) => seq(kw("STREAM"), field("name", $.identifier)),
  __import_stream_handle_clause: ($) =>
    seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
  __import_delimiter_clause: ($) => seq(kw("DELIMITER"), $.string_literal),
  __import_fields_clause: ($) =>
    seq(
      optional(alias($.__import_delimiter_clause, $.delimiter_clause)),
      $.__import_field_or_skip,
      repeat($.__import_field_or_skip),
      optional(
        seq(
          kw("EXCEPT"),
          $.__import_field_name,
          repeat($.__import_field_name),
        ),
      ),
    ),
  __import_unformatted_clause: ($) =>
    seq(kw("UNFORMATTED"), field("field", $.__import_field_name)),
  __import_field_or_skip: ($) =>
    choice($.__import_field_name, alias("^", $.skip_field)),
  __import_field_name: ($) => choice($.identifier, $.qualified_name),
  __import_no_lobs: ($) => token(/NO-LOBS/i),
  __import_no_error: ($) => token(/NO-ERROR/i),
});
