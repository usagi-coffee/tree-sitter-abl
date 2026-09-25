export default ({ kw }) => ({
  output_statement: ($) => seq($.__output_prefix, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence, tree-sitter-optimize/single-use-sequence
  __output_prefix: ($) => seq($._kw_output, optional($._stream_phrase), $.__output_body),
  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __output_body: ($) =>
    choice(
      alias($._close_keyword, $.close),
      seq(
        $._to_keyword,
        $.__output_to_target,
        // oxlint-disable-next-line tree-sitter-optimize/recurse
        repeat(
          choice(
            $.preprocessor_name,
            alias($._lob_dir_phrase, $.lob_dir_phrase),
            seq(kw("NUM-COPIES"), field("copies", $.__output_numeric_value)),
            alias($._kw_collate, $.collate),
            alias(kw("LANDSCAPE"), $.landscape),
            alias(kw("PORTRAIT"), $.portrait),
            // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
            alias(kw("APPEND"), $.append),
            alias(kw("BINARY"), $.binary),
            alias(kw("KEEP-MESSAGES"), $.keep_messages),
            $.__output_shared_option,
          ),
        ),
      ),
      // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
      seq(
        $._kw_through,
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

  // oxlint-disable-next-line tree-sitter-optimize/body-extraction, tree-sitter-optimize/choice-subset
  __output_shared_option: ($) =>
    choice(
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("ECHO"), $.echo),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      alias(kw("NO-ECHO"), $.no_echo),
      seq(
        $._kw_map,
        field(
          "map",
          choice(
            seq(
              $.identifier,
              // oxlint-disable-next-line tree-sitter-optimize/recurse
              repeat(seq("/", $.identifier)),
            ),
            $.string_literal,
          ),
        ),
      ),
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

  // oxlint-disable-next-line tree-sitter-optimize/body-extraction, tree-sitter-optimize/single-use-choice
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
