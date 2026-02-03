module.exports = ({ kw }) => ({
  input_through_statement: ($) =>
    seq(
      kw("INPUT"),
      optional($.__input_through_stream),
      kw("THROUGH"),
      $.__input_through_body,
      $._terminator,
    ),

  __input_through_stream: ($) => $._stream_phrase,

  __input_through_body: ($) =>
    seq(
      $.__input_through_program_target,
      repeat($.__input_through_argument),
      optional(choice(kw("ECHO"), kw("NO-ECHO"))),
      optional(
        choice(
          seq(kw("MAP"), field("map", $.__input_through_map_entry)),
          kw("NO-MAP"),
        ),
      ),
      optional(kw("UNBUFFERED")),
      optional(alias($.__input_through_convert_phrase, $.convert_phrase)),
    ),

  __input_through_program_target: ($) =>
    choice(
      field("program", $.identifier),
      field("program", $.string_literal),
      seq(kw("VALUE"), "(", $._expression, ")"),
    ),
  __input_through_argument: ($) =>
    choice(
      $.__input_through_arg_value,
      seq(kw("VALUE"), "(", $._expression, ")"),
    ),
  __input_through_arg_value: ($) =>
    choice(
      $.string_literal,
      $.number_literal,
      $.identifier,
      $.qualified_name,
      $.object_access,
      $.function_call,
      alias($.constant_expression, $.constant),
      alias($.__input_through_shell_variable, $.shell_variable),
    ),
  __input_through_shell_variable: ($) => token(/\$+[A-Za-z_0-9]*/),
  __input_through_map_entry: ($) => choice($.identifier, $.string_literal),
  __input_through_convert_phrase: ($) =>
    choice(
      kw("NO-CONVERT"),
      seq(
        kw("CONVERT"),
        optional(seq(kw("TARGET"), field("target", $.string_literal))),
        optional(seq(kw("SOURCE"), field("source", $.string_literal))),
      ),
    ),
});
