module.exports = ({ kw }) => ({
  output_statement: ($) => seq(kw("OUTPUT"), $.__output_body, $._terminator),

  __output_body: ($) =>
    seq(
      optional($.__output_stream),
      choice(
        alias(kw("CLOSE"), $.close),
        seq(kw("TO"), $.__output_to_target, repeat($.__output_to_option)),
        seq(
          kw("THROUGH"),
          $.__output_through_program_target,
          repeat($.__output_through_argument),
          repeat($.__output_through_option)
        )
      )
    ),

  __output_stream: ($) =>
    seq(choice(kw("STREAM"), kw("STREAM-HANDLE")), field("name", $.identifier)),

  __output_to_option: ($) =>
    choice(
      alias($.__output_lob_dir_phrase, $.lob_dir_phrase),
      alias($.__output_num_copies_phrase, $.num_copies_phrase),
      alias(kw("COLLATE"), $.collate),
      alias(kw("LANDSCAPE"), $.landscape),
      alias(kw("PORTRAIT"), $.portrait),
      alias(kw("APPEND"), $.append),
      alias(kw("BINARY"), $.binary),
      alias(kw("ECHO"), $.echo),
      alias(kw("NO-ECHO"), $.no_echo),
      alias(kw("KEEP-MESSAGES"), $.keep_messages),
      seq(kw("MAP"), field("map", $.__output_map_entry)),
      alias(kw("NO-MAP"), $.no_map),
      alias(kw("PAGED"), $.paged),
      alias($.__output_page_size_phrase, $.page_size_phrase),
      alias(kw("UNBUFFERED"), $.unbuffered),
      alias($.__output_convert_phrase, $.convert_phrase)
    ),

  __output_through_option: ($) =>
    choice(
      alias(kw("ECHO"), $.echo),
      alias(kw("NO-ECHO"), $.no_echo),
      seq(kw("MAP"), field("map", $.__output_map_entry)),
      alias(kw("NO-MAP"), $.no_map),
      alias(kw("PAGED"), $.paged),
      alias($.__output_page_size_phrase, $.page_size_phrase),
      alias(kw("UNBUFFERED"), $.unbuffered),
      alias($.__output_convert_phrase, $.convert_phrase)
    ),

  __output_convert_phrase: ($) =>
    choice(
      alias(kw("NO-CONVERT"), $.no_convert),
      seq(
        kw("CONVERT"),
        repeat(
          choice(
            seq(kw("TARGET"), field("target", $.string_literal)),
            seq(kw("SOURCE"), field("source", $.string_literal))
          )
        )
      )
    ),

  __output_lob_dir_phrase: ($) =>
    seq(
      kw("LOB-DIR"),
      field(
        "directory",
        choice(
          alias($.constant_expression, $.preprocessor_reference),
          seq(kw("VALUE"), "(", $._expression, ")")
        )
      )
    ),

  __output_num_copies_phrase: ($) =>
    seq(
      kw("NUM-COPIES"),
      field(
        "copies",
        choice(
          $.number_literal,
          alias($.constant_expression, $.preprocessor_reference),
          seq(kw("VALUE"), "(", $._expression, ")")
        )
      )
    ),

  __output_page_size_phrase: ($) =>
    seq(
      kw("PAGE-SIZE"),
      field(
        "page_size",
        choice(
          $.number_literal,
          alias($.constant_expression, $.preprocessor_reference),
          seq(kw("VALUE"), "(", $._expression, ")")
        )
      )
    ),

  __output_map_entry: ($) =>
    choice(
      seq($.identifier, repeat(seq("/", $.identifier))),
      $.identifier,
      $.string_literal
    ),

  __output_to_target: ($) =>
    choice(
      seq(kw("PRINTER"), optional(field("printer", $.__output_printer_target))),
      field(
        "file",
        choice(
          $.string_literal,
          alias($.constant_expression, $.preprocessor_reference),
          $.identifier,
          $.qualified_name
        )
      ),
      alias(kw("TERMINAL"), $.terminal),
      seq(kw("VALUE"), "(", $._expression, ")"),
      alias(kw("CLIPBOARD"), $.clipboard)
    ),

  __output_through_program_target: ($) =>
    choice(
      field("program", $.identifier),
      field("program", $.string_literal),
      seq(kw("VALUE"), "(", $._expression, ")")
    ),

  __output_through_argument: ($) =>
    choice(
      $.string_literal,
      $.number_literal,
      $.identifier,
      alias($.constant_expression, $.preprocessor_reference),
      seq(kw("VALUE"), "(", $._expression, ")")
    ),

  __output_printer_target: ($) =>
    choice(
      $.string_literal,
      $.identifier,
      alias($.constant_expression, $.preprocessor_reference)
    ),
});
