module.exports = ({ kw }) => ({
  import_statement: ($) => seq(kw("IMPORT"), $.__import_body, $._terminator),

  __import_body: ($) =>
    seq(
      optional($.__import_stream),
      choice(
        $.__import_fields_phrase,
        alias($.__import_unformatted_phrase, $.unformatted_phrase),
      ),
      optional(alias($.__import_no_lobs, $.no_lobs)),
      optional(alias($.__import_no_error, $.no_error)),
    ),

  __import_stream: ($) =>
    seq(
      choice(kw("STREAM"), kw("STREAM-HANDLE")),
      field("stream", $.identifier),
    ),

  __import_delimiter_phrase: ($) => seq(kw("DELIMITER"), $.string_literal),
  __import_fields_phrase: ($) =>
    seq(
      optional(alias($.__import_delimiter_phrase, $.delimiter_phrase)),
      $.__import_field_or_skip,
      repeat($.__import_field_or_skip),
      optional(
        seq(kw("EXCEPT"), $.__import_field_name, repeat($.__import_field_name)),
      ),
    ),
  __import_unformatted_phrase: ($) =>
    seq(kw("UNFORMATTED"), field("field", $.__import_field_name)),
  __import_field_or_skip: ($) =>
    choice($.__import_field_name, alias("^", $.skip_field)),
  __import_field_name: ($) => $._identifier_or_qualified_name,
  __import_no_lobs: ($) => kw("NO-LOBS"),
  __import_no_error: ($) => kw("NO-ERROR"),
});
