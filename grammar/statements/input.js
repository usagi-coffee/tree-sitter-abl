module.exports = ({ kw, tkw }) => ({
  input_statement: ($) => seq(kw("INPUT"), $.__input_body, $._terminator),

  __input_body: ($) =>
    seq(
      optional(
        choice(
          alias($.__input_stream_phrase, $.stream_phrase),
          alias($.__input_stream_handle_phrase, $.stream_handle_phrase),
        ),
      ),
      choice(tkw("CLOSE"), seq(kw("FROM"), $.__input_from_target)),
      optional(alias($.__input_lob_dir_phrase, $.lob_dir_phrase)),
      optional(kw("BINARY")),
      optional(choice(tkw("ECHO"), tkw("NO-ECHO"))),
      optional(
        choice(
          seq(kw("MAP"), field("map", $.__input_map_entry)),
          tkw("NO-MAP"),
        ),
      ),
      optional(kw("UNBUFFERED")),
      optional(alias($.__input_convert_phrase, $.convert_phrase)),
    ),

  __input_from_target: ($) =>
    choice(
      field("file", $.__input_file_target),
      tkw("TERMINAL"),
      seq(tkw("VALUE"), "(", $._expression, ")"),
      seq(
        tkw("OS-DIR"),
        "(",
        field("directory", $._expression),
        ")",
        optional(tkw("NO-ATTR-LIST")),
      ),
    ),
  __input_file_target: ($) =>
    choice(
      $.string_literal,
      $.identifier,
      $.qualified_name,
      $.scoped_name,
      $.object_access,
      $.function_call,
      alias($.constant_expression, $.constant),
    ),
  __input_lob_dir_phrase: ($) =>
    seq(
      kw("LOB-DIR"),
      choice(
        alias($.constant_expression, $.constant),
        seq(tkw("VALUE"), "(", $._expression, ")"),
      ),
    ),
  __input_map_entry: ($) => choice($.identifier, $.string_literal),
  __input_convert_phrase: ($) =>
    choice(
      tkw("NO-CONVERT"),
      seq(
        kw("CONVERT"),
        choice(
          seq(
            optional(seq(kw("TARGET"), field("target", $.string_literal))),
            optional(seq(kw("SOURCE"), field("source", $.string_literal))),
          ),
          seq(
            optional(seq(kw("SOURCE"), field("source", $.string_literal))),
            optional(seq(kw("TARGET"), field("target", $.string_literal))),
          ),
        ),
      ),
    ),
  __input_stream_phrase: ($) => seq(kw("STREAM"), field("name", $.identifier)),
  __input_stream_handle_phrase: ($) =>
    seq(kw("STREAM-HANDLE"), field("handle", $._expression)),
});
