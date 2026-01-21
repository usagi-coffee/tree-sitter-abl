module.exports = ({ kw }) => ({
  input_through_statement: ($) =>
    seq(
      kw("INPUT"),
      optional(
        choice(
          alias($.__input_through_stream_clause, $.stream_clause),
          alias($.__input_through_stream_handle_clause, $.stream_handle_clause),
        ),
      ),
      kw("THROUGH"),
      $.__input_through_program_target,
      repeat($.__input_through_argument),
      optional(choice(token(/ECHO/i), token(/NO-ECHO/i))),
      optional(
        choice(
          seq(kw("MAP"), field("map", $.__input_through_map_entry)),
          token(/NO-MAP/i),
        ),
      ),
      optional(kw("UNBUFFERED")),
      optional(alias($.__input_through_convert_clause, $.convert_clause)),
      $._terminator,
    ),

  __input_through_program_target: ($) =>
    choice(
      field("program", $.identifier),
      field("program", $.string_literal),
      seq(token(/VALUE/i), "(", $._expression, ")"),
    ),
  __input_through_argument: ($) =>
    choice(
      $.__input_through_arg_value,
      seq(token(/VALUE/i), "(", $._expression, ")"),
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
      $.constant,
    ),
  __input_through_map_entry: ($) => choice($.identifier, $.string_literal),
  __input_through_convert_clause: ($) =>
    choice(
      token(/NO-CONVERT/i),
      seq(
        kw("CONVERT"),
        optional(seq(kw("TARGET"), field("target", $.string_literal))),
        optional(seq(kw("SOURCE"), field("source", $.string_literal))),
      ),
    ),
  __input_through_stream_clause: ($) =>
    seq(kw("STREAM"), field("name", $.identifier)),
  __input_through_stream_handle_clause: ($) =>
    seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
});
