export default ({ kw }) => ({
  input_output_statement: ($) => seq($.__input_output_prefix, $.__input_output_body, $._terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __input_output_prefix: ($) => seq($._kw_input_output, optional($._stream_phrase)),
  __input_output_body: ($) =>
    choice(
      alias($._close_keyword, $.close),
      // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
      seq(
        $._kw_through,
        $._program_target,
        optional($.__input_output_arguments),
        optional($.__input_output_options),
      ),
    ),
  __input_output_arguments: ($) =>
    prec.right(
      seq(
        choice(
          $.string_literal,
          $.number_literal,
          $.identifier,
          $.preprocessor_name,
          $._value_expression,
        ),
        optional($.__input_output_arguments),
      ),
    ),
  __input_output_options: ($) =>
    prec.right(seq($.__input_output_option, optional($.__input_output_options))),
  // oxlint-disable-next-line tree-sitter-optimize/choice-subset, tree-sitter-optimize/single-use-choice
  __input_output_option: ($) =>
    choice(
      alias(kw("ECHO"), $.echo),
      alias(kw("NO-ECHO"), $.no_echo),
      $._map_phrase,
      alias(kw("UNBUFFERED"), $.unbuffered),
      alias($._convert_phrase, $.convert_phrase),
    ),
});
