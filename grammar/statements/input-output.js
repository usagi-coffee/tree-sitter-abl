module.exports = ({ kw, tkw }) => ({
  input_output_statement: ($) =>
    seq(kw("INPUT-OUTPUT"), $.__input_output_body, $._terminator),

  __input_output_body: ($) =>
    seq(
      optional(
        choice(
          alias($.__input_output_stream_phrase, $.stream_phrase),
          alias($.__input_output_stream_handle_phrase, $.stream_handle_phrase),
        ),
      ),
      choice(
        tkw("CLOSE"),
        seq(
          kw("THROUGH"),
          $.__input_output_through_target,
          repeat($.__input_output_through_argument),
          repeat($.__input_output_through_option),
        ),
      ),
    ),

  __input_output_stream_phrase: ($) =>
    seq(kw("STREAM"), field("name", $.identifier)),
  __input_output_stream_handle_phrase: ($) =>
    seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
  __input_output_through_target: ($) =>
    choice(
      field("program", $.identifier),
      field("program", $.string_literal),
      seq(tkw("VALUE"), "(", $._expression, ")"),
    ),
  __input_output_through_argument: ($) =>
    choice(
      $.string_literal,
      $.number_literal,
      $.identifier,
      alias($.constant_expression, $.constant),
      seq(tkw("VALUE"), "(", $._expression, ")"),
    ),
  __input_output_through_option: ($) =>
    choice(
      tkw("ECHO"),
      tkw("NO-ECHO"),
      seq(kw("MAP"), field("map", choice($.identifier, $.string_literal))),
      tkw("NO-MAP"),
      tkw("UNBUFFERED"),
      alias($.__input_output_convert_phrase, $.convert_phrase),
    ),
  __input_output_convert_phrase: ($) =>
    choice(
      tkw("NO-CONVERT"),
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
