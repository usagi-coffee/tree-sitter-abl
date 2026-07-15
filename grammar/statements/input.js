export default ({ kw }) => ({
  input_statement: ($) => seq($._input_stream_prefix, $.__input_body, $._terminator),

  __input_body: ($) =>
    choice(
      alias(kw("CLOSE"), $.close),
      seq(kw("FROM"), $.__input_from_target, optional($.__input_tail)),
    ),
  __input_tail: ($) =>
    choice(
      seq(
        alias($._lob_dir_phrase, $.lob_dir_phrase),
        optional(
          choice(
            seq(alias(kw("BINARY"), $.binary), optional($._echo_map_unbuffered_convert_tail)),
            $._echo_map_unbuffered_convert_tail,
          ),
        ),
      ),
      seq(alias(kw("BINARY"), $.binary), optional($._echo_map_unbuffered_convert_tail)),
      $._echo_map_unbuffered_convert_tail,
    ),

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
    choice($.opsys_file, $.string_literal, $._identifier_or_access_or_call, $.preprocessor_name),
});
