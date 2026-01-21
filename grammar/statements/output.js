module.exports = ({ kw }) => ({
  output_statement: ($) =>
    seq(
      kw("OUTPUT"),
      choice(
        seq(
          optional(
            choice(
              alias($.__output_stream_clause, $.stream_clause),
              alias($.__output_stream_handle_clause, $.stream_handle_clause),
            ),
          ),
          token(/CLOSE/i),
        ),
        seq(
          optional(
            choice(
              alias($.__output_stream_clause, $.stream_clause),
              alias($.__output_stream_handle_clause, $.stream_handle_clause),
            ),
          ),
          kw("TO"),
          $.__output_to_target,
          repeat($.__output_to_option),
        ),
        seq(
          optional(
            choice(
              alias($.__output_stream_clause, $.stream_clause),
              alias($.__output_stream_handle_clause, $.stream_handle_clause),
            ),
          ),
          kw("THROUGH"),
          $.__output_through_program_target,
          repeat($.__output_through_argument),
          repeat($.__output_through_option),
        ),
      ),
      $._terminator,
    ),

  __output_append_clause: ($) => token(/APPEND/i),
  __output_to_option: ($) =>
    choice(
      alias($.__output_lob_dir_clause, $.lob_dir_clause),
      alias($.__output_num_copies_clause, $.num_copies_clause),
      kw("COLLATE"),
      choice(kw("LANDSCAPE"), kw("PORTRAIT")),
      alias($.__output_append_clause, $.append_clause),
      kw("BINARY"),
      token(/ECHO/i),
      token(/NO-ECHO/i),
      kw("KEEP-MESSAGES"),
      seq(kw("MAP"), field("map", $.__output_map_entry)),
      token(/NO-MAP/i),
      kw("PAGED"),
      alias($.__output_page_size_clause, $.page_size_clause),
      kw("UNBUFFERED"),
      alias($.__output_convert_clause, $.convert_clause),
    ),
  __output_through_option: ($) =>
    choice(
      token(/ECHO/i),
      token(/NO-ECHO/i),
      seq(kw("MAP"), field("map", $.__output_map_entry)),
      token(/NO-MAP/i),
      kw("PAGED"),
      alias($.__output_page_size_clause, $.page_size_clause),
      kw("UNBUFFERED"),
      alias($.__output_convert_clause, $.convert_clause),
    ),
  __output_convert_clause: ($) =>
    seq(
      choice(
        token(/NO-CONVERT/i),
        seq(
          kw("CONVERT"),
          optional(seq(kw("TARGET"), field("target", $.string_literal))),
          optional(seq(kw("SOURCE"), field("source", $.string_literal))),
        ),
      ),
    ),
  __output_lob_dir_clause: ($) =>
    seq(
      kw("LOB-DIR"),
      choice($.constant, seq(token(/VALUE/i), "(", $._expression, ")")),
    ),
  __output_num_copies_clause: ($) =>
    seq(
      kw("NUM-COPIES"),
      choice(
        $.number_literal,
        $.constant,
        seq(token(/VALUE/i), "(", $._expression, ")"),
      ),
    ),
  __output_page_size_clause: ($) =>
    seq(
      kw("PAGE-SIZE"),
      choice(
        $.number_literal,
        $.constant,
        seq(token(/VALUE/i), "(", $._expression, ")"),
      ),
    ),
  __output_map_entry: ($) => choice($.identifier, $.string_literal),
  __output_to_target: ($) =>
    choice(
      seq(kw("PRINTER"), optional(field("printer", $.__output_printer_target))),
      field("file", choice($.string_literal, $.constant)),
      token(/TERMINAL/i),
      seq(token(/VALUE/i), "(", $._expression, ")"),
      token(/\"CLIPBOARD\"/i),
    ),
  __output_through_program_target: ($) =>
    choice(
      field("program", $.identifier),
      field("program", $.string_literal),
      seq(token(/VALUE/i), "(", $._expression, ")"),
    ),
  __output_through_argument: ($) =>
    choice($.__output_argument, seq(token(/VALUE/i), "(", $._expression, ")")),
  __output_argument: ($) =>
    choice(
      $.string_literal,
      $.number_literal,
      $.identifier,
      $.constant,
    ),
  __output_stream_clause: ($) => seq(kw("STREAM"), field("name", $.identifier)),
  __output_stream_handle_clause: ($) =>
    seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
  __output_printer_target: ($) =>
    choice($.string_literal, $.identifier, $.constant),
});
