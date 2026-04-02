module.exports = ({ kw }) => ({
  input_statement: ($) => seq(kw("INPUT"), $.__input_body, $._terminator),

  __input_body: ($) =>
    seq(
      optional($.__output_stream),
      choice(
        alias(kw("CLOSE"), $.close),
        seq(kw("FROM"), $.__input_from_target, optional($.__input_tail)),
      ),
    ),
  __input_tail: ($) =>
    choice(
      seq(
        alias($.__output_lob_dir_phrase, $.lob_dir_phrase),
        optional($.__input_tail_after_lob_dir),
      ),
      seq(alias(kw("BINARY"), $.binary), optional($.__input_tail_after_binary)),
      seq($.__input_echo, optional($.__input_tail_after_echo)),
      seq($.__input_map, optional($.__input_tail_after_map)),
      seq(
        alias(kw("UNBUFFERED"), $.unbuffered),
        optional(alias($.__input_convert_phrase, $.convert_phrase)),
      ),
      alias($.__input_convert_phrase, $.convert_phrase),
    ),
  __input_tail_after_lob_dir: ($) =>
    choice(
      seq(alias(kw("BINARY"), $.binary), optional($.__input_tail_after_binary)),
      seq($.__input_echo, optional($.__input_tail_after_echo)),
      seq($.__input_map, optional($.__input_tail_after_map)),
      seq(
        alias(kw("UNBUFFERED"), $.unbuffered),
        optional(alias($.__input_convert_phrase, $.convert_phrase)),
      ),
      alias($.__input_convert_phrase, $.convert_phrase),
    ),
  __input_tail_after_binary: ($) =>
    choice(
      seq($.__input_echo, optional($.__input_tail_after_echo)),
      seq($.__input_map, optional($.__input_tail_after_map)),
      seq(
        alias(kw("UNBUFFERED"), $.unbuffered),
        optional(alias($.__input_convert_phrase, $.convert_phrase)),
      ),
      alias($.__input_convert_phrase, $.convert_phrase),
    ),
  __input_tail_after_echo: ($) =>
    choice(
      seq($.__input_map, optional($.__input_tail_after_map)),
      seq(
        alias(kw("UNBUFFERED"), $.unbuffered),
        optional(alias($.__input_convert_phrase, $.convert_phrase)),
      ),
      alias($.__input_convert_phrase, $.convert_phrase),
    ),
  __input_tail_after_map: ($) =>
    choice(
      seq(
        alias(kw("UNBUFFERED"), $.unbuffered),
        optional(alias($.__input_convert_phrase, $.convert_phrase)),
      ),
      alias($.__input_convert_phrase, $.convert_phrase),
    ),
  __input_echo: ($) => choice(alias(kw("ECHO"), $.echo), alias(kw("NO-ECHO"), $.no_echo)),
  __input_map: ($) =>
    choice(seq(kw("MAP"), field("map", $.__input_map_entry)), alias(kw("NO-MAP"), $.no_map)),

  __input_from_target: ($) =>
    choice(
      field("file", $.__input_file_target),
      alias(kw("TERMINAL"), $.terminal),
      $._value_expression,
      seq(
        kw("OS-DIR"),
        "(",
        field("directory", $._expression),
        ")",
        optional(alias(kw("NO-ATTR-LIST"), $.no_attr_list)),
      ),
    ),
  __input_file_target: ($) =>
    choice($.string_literal, $._identifier_or_access_or_call, $.preprocessor_name),
  __input_map_entry: ($) => $._identifier_or_string_literal,
  __input_convert_phrase: ($) =>
    choice(
      alias(kw("NO-CONVERT"), $.no_convert),
      seq(
        kw("CONVERT"),
        choice(
          seq(
            optional(seq(kw("TARGET"), field("target", $.string_literal))),
            optional(seq(kw("SOURCE"), field("source", $.string_literal))),
          ),
          seq(
            optional(seq(kw("SOURCE"), field("source", $.string_literal))),
            optional(seq(kw("TARGET"), field("target", $.string_literal))),
          ),
        ),
      ),
    ),
});
