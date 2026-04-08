module.exports = ({ kw }) => ({
  input_output_statement: ($) =>
    seq(kw("INPUT-OUTPUT"), optional($._stream_phrase), $.__input_output_body, $._terminator),

  __input_output_body: ($) =>
    choice(
      alias(kw("CLOSE"), $.close),
      seq(
        kw("THROUGH"),
        $._program_target,
        repeat($.__input_output_through_argument),
        repeat($.__input_output_through_option),
      ),
    ),

  __input_output_through_argument: ($) =>
    choice(
      $.string_literal,
      $.number_literal,
      $.identifier,
      $.preprocessor_name,
      $._value_expression,
    ),

  __input_output_through_option: ($) =>
    choice(
      alias(kw("ECHO"), $.echo),
      alias(kw("NO-ECHO"), $.no_echo),
      seq(kw("MAP"), field("map", $._identifier_or_string_literal)),
      alias(kw("NO-MAP"), $.no_map),
      alias(kw("UNBUFFERED"), $.unbuffered),
      alias($._convert_phrase, $.convert_phrase),
    ),
});
