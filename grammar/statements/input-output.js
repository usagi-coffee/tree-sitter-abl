export default ({ kw }) => ({
  input_output_statement: ($) => seq($.__input_output_prefix, $.__input_output_body, $._terminator),

  __input_output_prefix: ($) => seq(kw("INPUT-OUTPUT", { offset: 7 }), optional($._stream_phrase)),
  __input_output_body: ($) =>
    choice(
      alias($._close_keyword, $.close),
      seq(
        kw("THROUGH"),
        $._program_target,
        optional($.__input_output_arguments),
        repeat(
          choice(
            alias(kw("ECHO"), $.echo),
            alias(kw("NO-ECHO"), $.no_echo),
            $._map_phrase,
            alias(kw("UNBUFFERED"), $.unbuffered),
            alias($._convert_phrase, $.convert_phrase),
          ),
        ),
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
});
