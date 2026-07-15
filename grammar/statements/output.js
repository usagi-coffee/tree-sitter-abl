export default ({ kw }) => ({
  output_statement: ($) => seq($.__output_prefix, $.__output_body, $._terminator),

  __output_prefix: ($) => seq(kw("OUTPUT"), optional($._stream_phrase)),
  __output_body: ($) =>
    choice(
      alias(kw("CLOSE"), $.close),
      seq(
        kw("TO"),
        $.__output_to_target,
        repeat(
          choice(
            $.preprocessor_name,
            alias($._lob_dir_phrase, $.lob_dir_phrase),
            alias($.__output_num_copies_phrase, $.num_copies_phrase),
            alias(kw("COLLATE"), $.collate),
            alias(kw("LANDSCAPE"), $.landscape),
            alias(kw("PORTRAIT"), $.portrait),
            alias(kw("APPEND"), $.append),
            alias(kw("BINARY"), $.binary),
            alias(kw("KEEP-MESSAGES"), $.keep_messages),
            $.__output_shared_option,
          ),
        ),
      ),
      seq(
        kw("THROUGH"),
        $._program_target,
        repeat(
          choice(
            $.string_literal,
            $.number_literal,
            $.identifier,
            $.preprocessor_name,
            alias($.__output_program_flag, $.program_flag),
            $._value_expression,
          ),
        ),
        repeat($.__output_shared_option),
      ),
    ),

  __output_shared_option: ($) =>
    choice(
      alias(kw("ECHO"), $.echo),
      alias(kw("NO-ECHO"), $.no_echo),
      seq(kw("MAP"), field("map", $.__output_map_entry)),
      alias(kw("NO-MAP"), $.no_map),
      alias(kw("PAGED"), $.paged),
      alias($.__output_page_size_phrase, $.page_size_phrase),
      alias(kw("UNBUFFERED"), $.unbuffered),
      alias($._convert_phrase, $.convert_phrase),
    ),

  __output_num_copies_phrase: ($) =>
    seq(
      kw("NUM-COPIES"),
      field("copies", choice($.number_literal, $.preprocessor_name, $._value_expression)),
    ),

  __output_page_size_phrase: ($) =>
    seq(
      kw("PAGE-SIZE"),
      field("page_size", choice($.number_literal, $.preprocessor_name, $._value_expression)),
    ),

  __output_map_entry: ($) =>
    choice(seq($.identifier, repeat(seq("/", $.identifier))), $.identifier, $.string_literal),

  __output_to_target: ($) =>
    choice(
      prec.right(
        seq(
          kw("PRINTER"),
          optional(field("printer", choice($.string_literal, $.identifier, $.preprocessor_name))),
        ),
      ),
      field(
        "file",
        choice($.opsys_file, $.string_literal, $.preprocessor_name, $.identifier, $.qualified_name),
      ),
      alias(kw("TERMINAL"), $.terminal),
      $._value_expression,
      alias(kw("CLIPBOARD"), $.clipboard),
    ),

  __output_program_flag: ($) => token(/-[A-Za-z][A-Za-z0-9-]*/),
});
