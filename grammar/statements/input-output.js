module.exports = ({ kw }) => ({
  input_output_statement: ($) =>
    seq(
      kw("INPUT-OUTPUT"),
      optional($._stream_phrase),
      $.__input_output_body,
      $._terminator,
    ),

  __input_output_body: ($) =>
    choice(
      alias(kw("CLOSE"), $.close),
      seq(
        kw("THROUGH"),
        $.__input_output_through_target,
        repeat($.__input_output_through_argument),
        repeat($.__input_output_through_option),
      ),
    ),

  __input_output_through_target: ($) =>
    choice(
      field("program", $.identifier),
      field("program", $.string_literal),
      seq(kw("VALUE"), "(", $._expression, ")"),
    ),

  __input_output_through_argument: ($) =>
    choice(
      $.string_literal,
      $.number_literal,
      $.identifier,
      alias($.constant_expression, $.preprocessor_reference),
      seq(kw("VALUE"), "(", $._expression, ")"),
    ),

  __input_output_through_option: ($) =>
    choice(
      alias(kw("ECHO"), $.echo),
      alias(kw("NO-ECHO"), $.no_echo),
      seq(kw("MAP"), field("map", choice($.identifier, $.string_literal))),
      alias(kw("NO-MAP"), $.no_map),
      alias(kw("UNBUFFERED"), $.unbuffered),
      alias($.__input_output_convert_phrase, $.convert_phrase),
    ),

  __input_output_convert_phrase: ($) =>
    choice(
      alias(kw("NO-CONVERT"), $.no_convert),
      seq(
        kw("CONVERT"),
        repeat(
          choice(
            seq(kw("TARGET"), field("target", $.string_literal)),
            seq(kw("SOURCE"), field("source", $.string_literal)),
          ),
        ),
      ),
    ),
});
