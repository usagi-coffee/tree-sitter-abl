module.exports = ({ kw }) => ({
  input_statement: ($) => seq(kw("INPUT"), $.__input_body, $._terminator),

  __input_body: ($) =>
    seq(
      optional($.__input_stream),
      choice(kw("CLOSE"), seq(kw("FROM"), $.__input_from_target)),
      optional(alias($.__input_lob_dir_phrase, $.lob_dir_phrase)),
      optional(alias(kw("BINARY"), $.binary)),
      optional(choice(alias(kw("ECHO"), $.echo), alias(kw("NO-ECHO"), $.no_echo))),
      optional(
        choice(
          seq(kw("MAP"), field("map", $.__input_map_entry)),
          alias(kw("NO-MAP"), $.no_map),
        ),
      ),
      optional(alias(kw("UNBUFFERED"), $.unbuffered)),
      optional(alias($.__input_convert_phrase, $.convert_phrase)),
    ),

  __input_stream: ($) =>
    seq(choice(kw("STREAM"), kw("STREAM-HANDLE")), field("name", $.identifier)),

  __input_from_target: ($) =>
    choice(
      field("file", $.__input_file_target),
      alias(kw("TERMINAL"), $.terminal),
      seq(kw("VALUE"), "(", field("value", $._expression), ")"),
      seq(
        kw("OS-DIR"),
        "(",
        field("directory", $._expression),
        ")",
        optional(alias(kw("NO-ATTR-LIST"), $.no_attr_list)),
      ),
    ),
  __input_file_target: ($) =>
    choice(
      $.string_literal,
      $.identifier,
      $.qualified_name,
      $.object_access,
      $.function_call,
      $.preprocessor_name,
    ),
  __input_lob_dir_phrase: ($) =>
    seq(
      kw("LOB-DIR"),
      field(
        "directory",
        choice(
          $.preprocessor_name,
          seq(kw("VALUE"), "(", field("value", $._expression), ")"),
        ),
      ),
    ),
  __input_map_entry: ($) => choice($.identifier, $.string_literal),
  __input_convert_phrase: ($) =>
    choice(
      alias(kw("NO-CONVERT"), $.no_convert),
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
});
