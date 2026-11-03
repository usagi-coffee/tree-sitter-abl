export default ({ kw }) => ({
  copy_lob_statement: ($) => seq($.__copy_lob_prefix, $._no_error_terminator),

  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __copy_lob_prefix: ($) =>
    seq(
      kw("COPY-LOB"),
      optional($._kw_from),
      $.__copy_lob_source,
      optional(seq(kw("STARTING"), $._kw_at, field("starting_at", $._expression))),
      optional(seq($._kw_for, field("for_length", $._expression))),
      $._kw_to,
      $.__copy_lob_target,
      optional($.__copy_lob_conversion),
    ),

  __copy_lob_source: ($) =>
    choice(
      seq(optional($._kw_object), field("source", $._expression)),
      seq($._kw_file, field("source_file", $._expression)),
    ),
});
