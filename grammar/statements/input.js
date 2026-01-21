module.exports = ({ kw }) => ({
  input_statement: ($) =>
    seq(
      kw("INPUT"),
      optional(
        choice(
          alias($.__input_stream_clause, $.stream_clause),
          alias($.__input_stream_handle_clause, $.stream_handle_clause),
        ),
      ),
      choice(
        token(/CLOSE/i),
        seq(kw("FROM"), $.__input_from_target),
      ),
      optional(alias($.__input_lob_dir_clause, $.lob_dir_clause)),
      optional(kw("BINARY")),
      optional(choice(token(/ECHO/i), token(/NO-ECHO/i))),
      optional(
        choice(
          seq(kw("MAP"), field("map", $.__input_map_entry)),
          token(/NO-MAP/i),
        ),
      ),
      optional(kw("UNBUFFERED")),
      optional(alias($.__input_convert_clause, $.convert_clause)),
      $._terminator,
    ),

  __input_from_target: ($) =>
    choice(
      field("file", $.__input_file_target),
      token(/TERMINAL/i),
      seq(token(/VALUE/i), "(", $._expression, ")"),
      seq(
        token(/OS-DIR/i),
        "(",
        field("directory", $._expression),
        ")",
        optional(token(/NO-ATTR-LIST/i)),
      ),
    ),
  __input_file_target: ($) =>
    choice(
      $.string_literal,
      $.identifier,
      $.qualified_name,
      $.scoped_name,
      $.object_access,
      $.function_call,
      $.constant,
    ),
  __input_lob_dir_clause: ($) =>
    seq(
      kw("LOB-DIR"),
      choice($.constant, seq(token(/VALUE/i), "(", $._expression, ")")),
    ),
  __input_map_entry: ($) => choice($.identifier, $.string_literal),
  __input_convert_clause: ($) =>
    choice(
      token(/NO-CONVERT/i),
      seq(
        kw("CONVERT"),
        optional(seq(kw("TARGET"), field("target", $.string_literal))),
        optional(seq(kw("SOURCE"), field("source", $.string_literal))),
      ),
    ),
  __input_stream_clause: ($) => seq(kw("STREAM"), field("name", $.identifier)),
  __input_stream_handle_clause: ($) =>
    seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
});
