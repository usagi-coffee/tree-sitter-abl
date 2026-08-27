export default ({ kw }) => ({
  output_statement: ($) => seq($.__output_prefix, $._terminator),

  __output_prefix: ($) => seq(kw("OUTPUT"), optional($._stream_phrase), $.__output_body),
  __output_body: ($) =>
    choice(
      alias($._close_keyword, $.close),
      seq(
        $._to_keyword,
        $.__output_to_target,
        // deopt: recurse
        repeat(
          choice(
            $.preprocessor_name,
            alias($._lob_dir_phrase, $.lob_dir_phrase),
            seq(kw("NUM-COPIES"), field("copies", $.__output_numeric_value)),
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
        optional($.__output_program_items),
        optional($.__output_shared_options),
      ),
    ),

  __output_program_items: ($) =>
    prec.right(
      seq(
        choice(
          $.string_literal,
          $.number_literal,
          $.identifier,
          $.preprocessor_name,
          alias($.__output_program_flag, $.program_flag),
          $._value_expression,
        ),
        optional($.__output_program_items),
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
  __output_shared_options: ($) =>
    prec.right(seq($.__output_shared_option, optional($.__output_shared_options))),

  __output_page_size_phrase: ($) =>
    seq(kw("PAGE-SIZE"), field("page_size", $.__output_numeric_value)),
  __output_numeric_value: ($) => choice($.number_literal, $.preprocessor_name, $._value_expression),

  __output_map_entry: ($) =>
    choice(
      seq(
        $.identifier,
        // deopt: recurse
        repeat(seq("/", $.identifier)),
      ),
      $.string_literal,
    ),

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
