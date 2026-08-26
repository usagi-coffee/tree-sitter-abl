export default ({ kw }) => ({
  import_statement: ($) => seq($.__import_prefix, $.__import_body, $._no_error_terminator),

  __import_prefix: ($) => seq(kw("IMPORT"), optional($._stream_phrase)),
  __import_body: ($) =>
    seq(
      choice($.__import_fields_phrase, alias($.__import_unformatted_phrase, $.unformatted_phrase)),
      optional(alias(kw("NO-LOBS"), $.no_lobs)),
    ),

  __import_delimiter_phrase: ($) => seq(kw("DELIMITER"), field("delimiter", $.string_literal)),
  __import_fields_phrase: ($) =>
    seq(
      optional(alias($.__import_delimiter_phrase, $.delimiter_phrase)),
      $.__import_fields,
      optional(seq(kw("EXCEPT"), $.__import_except_names)),
    ),
  __import_except_names: ($) =>
    prec.right(seq($._identifier_or_qualified_name, optional($.__import_except_names))),
  __import_fields: ($) =>
    prec.right(
      seq(
        choice($._identifier_or_qualified_name, alias("^", $.skip_field)),
        optional($.__import_fields),
      ),
    ),
  __import_unformatted_phrase: ($) =>
    seq(kw("UNFORMATTED"), field("field", $._identifier_or_qualified_name)),
});
