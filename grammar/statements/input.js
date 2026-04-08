module.exports = ({ kw }) => ({
  input_statement: ($) => seq(kw("INPUT"), $.__input_body, $._terminator),

  __input_body: ($) =>
    seq(
      optional($._stream_phrase),
      choice(
        alias(kw("CLOSE"), $.close),
        seq(kw("FROM"), $.__input_from_target, optional($.__input_tail)),
      ),
    ),
  __input_tail: ($) =>
    choice(
      seq(alias($._lob_dir_phrase, $.lob_dir_phrase), optional($.__input_tail_after_lob_dir)),
      seq(alias(kw("BINARY"), $.binary), optional($.__input_tail_after_binary)),
      seq($._echo_phrase, optional($.__input_tail_after_echo)),
      seq($.__input_map, optional($.__input_tail_after_map)),
      $._unbuffered_convert_tail,
    ),
  __input_tail_after_lob_dir: ($) =>
    choice(
      seq(alias(kw("BINARY"), $.binary), optional($.__input_tail_after_binary)),
      seq($._echo_phrase, optional($.__input_tail_after_echo)),
      seq($.__input_map, optional($.__input_tail_after_map)),
      $._unbuffered_convert_tail,
    ),
  __input_tail_after_binary: ($) =>
    choice(
      seq($._echo_phrase, optional($.__input_tail_after_echo)),
      seq($.__input_map, optional($.__input_tail_after_map)),
      $._unbuffered_convert_tail,
    ),
  __input_tail_after_echo: ($) =>
    choice(seq($.__input_map, optional($.__input_tail_after_map)), $._unbuffered_convert_tail),
  __input_tail_after_map: ($) => $._unbuffered_convert_tail,
  __input_map: ($) =>
    choice(seq(kw("MAP"), field("map", $._map_entry)), alias(kw("NO-MAP"), $.no_map)),

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
});
