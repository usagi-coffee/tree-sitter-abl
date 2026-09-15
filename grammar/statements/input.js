export default ({ kw }) => ({
  input_statement: ($) => seq($._input_stream_prefix, $.__input_body, $._terminator),

  __input_body: ($) =>
    choice(
      alias($._close_keyword, $.close),
      // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
      seq(
        kw("FROM"),
        $.__input_from_target,
        optional(alias($._lob_dir_phrase, $.lob_dir_phrase)),
        optional(choice($.__input_binary_tail, $._echo_map_unbuffered_convert_tail)),
      ),
    ),
  __input_binary_tail: ($) =>
    seq(alias(kw("BINARY"), $.binary), optional($._echo_map_unbuffered_convert_tail)),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice, tree-sitter-optimize/body-extraction
  __input_from_target: ($) =>
    choice(
      field(
        "file",
        choice($.opsys_file, $._string_or_identifier_access_or_call, $.preprocessor_name),
      ),
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
});
