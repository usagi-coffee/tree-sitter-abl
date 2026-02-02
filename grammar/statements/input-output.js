module.exports = ({ kw }) => ({
  input_output_statement: ($) =>
    seq(
      kw("INPUT-OUTPUT"),
      optional($.__input_output_stream),
      $.__input_output_body,
      $._terminator,
    ),

  __input_output_stream: ($) =>
    seq(
      choice(kw("STREAM"), kw("STREAM-HANDLE")),
      field("stream", $.identifier),
    ),

  __input_output_body: ($) =>
    choice(
      kw("CLOSE"),
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
      alias($.constant_expression, $.constant),
      seq(kw("VALUE"), "(", $._expression, ")"),
    ),

  __input_output_through_option: ($) =>
    choice(
      kw("ECHO"),
      kw("NO-ECHO"),
      seq(kw("MAP"), field("map", choice($.identifier, $.string_literal))),
      kw("NO-MAP"),
      kw("UNBUFFERED"),
      alias($.__input_output_convert_phrase, $.convert_phrase),
    ),

  __input_output_convert_phrase: ($) =>
    choice(
      kw("NO-CONVERT"),
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
