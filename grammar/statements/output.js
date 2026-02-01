module.exports = ({ kw }) => ({
  output_statement: ($) => seq(kw("OUTPUT"), $.__output_body, $._terminator),

  __output_body: ($) =>
    seq(
      choice(
        seq(
          optional(
            choice(
              alias($.__output_stream_phrase, $.stream_phrase),
              alias($.__output_stream_handle_phrase, $.stream_handle_phrase),
            ),
          ),
          kw("CLOSE"),
        ),
        seq(
          optional(
            choice(
              alias($.__output_stream_phrase, $.stream_phrase),
              alias($.__output_stream_handle_phrase, $.stream_handle_phrase),
            ),
          ),
          kw("TO"),
          $.__output_to_target,
          repeat($.__output_to_option),
        ),
        seq(
          optional(
            choice(
              alias($.__output_stream_phrase, $.stream_phrase),
              alias($.__output_stream_handle_phrase, $.stream_handle_phrase),
            ),
          ),
          kw("THROUGH"),
          $.__output_through_program_target,
          repeat($.__output_through_argument),
          repeat($.__output_through_option),
        ),
      ),
    ),

  __output_append_phrase: ($) => kw("APPEND"),
  __output_to_option: ($) =>
    choice(
      alias($.__output_lob_dir_phrase, $.lob_dir_phrase),
      alias($.__output_num_copies_phrase, $.num_copies_phrase),
      kw("COLLATE"),
      choice(kw("LANDSCAPE"), kw("PORTRAIT")),
      alias($.__output_append_phrase, $.append_phrase),
      kw("BINARY"),
      kw("ECHO"),
      kw("NO-ECHO"),
      kw("KEEP-MESSAGES"),
      seq(kw("MAP"), field("map", $.__output_map_entry)),
      kw("NO-MAP"),
      kw("PAGED"),
      alias($.__output_page_size_phrase, $.page_size_phrase),
      kw("UNBUFFERED"),
      alias($.__output_convert_phrase, $.convert_phrase),
    ),
  __output_through_option: ($) =>
    choice(
      kw("ECHO"),
      kw("NO-ECHO"),
      seq(kw("MAP"), field("map", $.__output_map_entry)),
      kw("NO-MAP"),
      kw("PAGED"),
      alias($.__output_page_size_phrase, $.page_size_phrase),
      kw("UNBUFFERED"),
      alias($.__output_convert_phrase, $.convert_phrase),
    ),
  __output_convert_phrase: ($) =>
    choice(
      kw("NO-CONVERT"),
      seq(
        kw("CONVERT"),
        repeat(
          choice(
            seq(kw("TARGET"), field("target", $.string_literal)),
            seq(kw("SOURCE"), field("source", $.string_literal)),
          ),
        ),
      ),
    ),
  __output_lob_dir_phrase: ($) =>
    seq(
      kw("LOB-DIR"),
      choice(
        alias($.constant_expression, $.constant),
        seq(kw("VALUE"), "(", $._expression, ")"),
      ),
    ),
  __output_num_copies_phrase: ($) =>
    seq(
      kw("NUM-COPIES"),
      choice(
        $.number_literal,
        alias($.constant_expression, $.constant),
        seq(kw("VALUE"), "(", $._expression, ")"),
      ),
    ),
  __output_page_size_phrase: ($) =>
    seq(
      kw("PAGE-SIZE"),
      choice(
        $.number_literal,
        alias($.constant_expression, $.constant),
        seq(kw("VALUE"), "(", $._expression, ")"),
      ),
    ),
  __output_map_entry: ($) =>
    choice(
      seq($.identifier, repeat(seq("/", $.identifier))),
      $.identifier,
      $.string_literal,
    ),
  __output_to_target: ($) =>
    choice(
      seq(kw("PRINTER"), optional(field("printer", $.__output_printer_target))),
      field(
        "file",
        choice(
          $.string_literal,
          alias($.constant_expression, $.constant),
          $.identifier,
          $.qualified_name,
        ),
      ),
      kw("TERMINAL"),
      seq(kw("VALUE"), "(", $._expression, ")"),
      token(kw("CLIPBOARD")),
    ),
  __output_through_program_target: ($) =>
    choice(
      field("program", $.identifier),
      field("program", $.string_literal),
      seq(kw("VALUE"), "(", $._expression, ")"),
    ),
  __output_through_argument: ($) =>
    choice($.__output_argument, seq(kw("VALUE"), "(", $._expression, ")")),
  __output_argument: ($) =>
    choice(
      $.string_literal,
      $.number_literal,
      $.identifier,
      alias($.constant_expression, $.constant),
    ),
  __output_stream_phrase: ($) => seq(kw("STREAM"), field("name", $.identifier)),
  __output_stream_handle_phrase: ($) =>
    seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
  __output_printer_target: ($) =>
    choice(
      $.string_literal,
      $.identifier,
      alias($.constant_expression, $.constant),
    ),
});
