export default ({ kw }) => ({
  import_statement: ($) => seq($.__import_prefix, $.__import_body, $._no_error_terminator),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-keyword-sequence
  __import_prefix: ($) => seq(kw("IMPORT"), optional($._stream_phrase)),
  __import_body: ($) =>
    seq(
      choice($.__import_fields_phrase, alias($.__import_unformatted_phrase, $.unformatted_phrase)),
      // oxlint-disable-next-line tree-sitter-optimize/inline-keyword-owner
      optional(alias(kw("NO-LOBS"), $.no_lobs)),
    ),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-optional-sequence
  __import_fields_phrase: ($) =>
    seq(
      optional($.delimiter_phrase),
      $.__import_fields,
      optional(seq($._kw_except, $._import_export_except_names)),
    ),
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
