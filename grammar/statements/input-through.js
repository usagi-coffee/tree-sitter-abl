module.exports = ({ kw, tkw }) => ({
  input_through_statement: ($) =>
    seq(
      kw("INPUT"),
      optional(
        choice(
          alias($.__input_through_stream_phrase, $.stream_phrase),
          alias($.__input_through_stream_handle_phrase, $.stream_handle_phrase),
        ),
      ),
      kw("THROUGH"),
      $.__input_through_program_target,
      repeat($.__input_through_argument),
      optional(choice(tkw("ECHO"), tkw("NO-ECHO"))),
      optional(
        choice(
          seq(kw("MAP"), field("map", $.__input_through_map_entry)),
          tkw("NO-MAP"),
        ),
      ),
      optional(kw("UNBUFFERED")),
      optional(alias($.__input_through_convert_phrase, $.convert_phrase)),
      $._terminator,
    ),

  __input_through_program_target: ($) =>
    choice(
      field("program", $.identifier),
      field("program", $.string_literal),
      seq(tkw("VALUE"), "(", $._expression, ")"),
    ),
  __input_through_argument: ($) =>
    choice(
      $.__input_through_arg_value,
      seq(tkw("VALUE"), "(", $._expression, ")"),
    ),
  __input_through_arg_value: ($) =>
    choice(
      $.string_literal,
      $.number_literal,
      $.identifier,
      $.qualified_name,
      $.scoped_name,
      $.object_access,
      $.function_call,
      alias($.constant_expression, $.constant),
    ),
  __input_through_map_entry: ($) => choice($.identifier, $.string_literal),
  __input_through_convert_phrase: ($) =>
    choice(
      tkw("NO-CONVERT"),
      seq(
        kw("CONVERT"),
        optional(seq(kw("TARGET"), field("target", $.string_literal))),
        optional(seq(kw("SOURCE"), field("source", $.string_literal))),
      ),
    ),
  __input_through_stream_phrase: ($) =>
    seq(kw("STREAM"), field("name", $.identifier)),
  __input_through_stream_handle_phrase: ($) =>
    seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
});
