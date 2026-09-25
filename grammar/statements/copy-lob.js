export default ({ kw }) => ({
  copy_lob_statement: ($) => seq($.__copy_lob_prefix, $._no_error_terminator),

  // oxlint-disable-next-line tree-sitter-optimize/body-extraction
  __copy_lob_prefix: ($) =>
    seq(
      kw("COPY-LOB"),
      optional($._kw_from),
      $.__copy_lob_source,
      optional(seq(kw("STARTING"), $._at_keyword, field("starting_at", $._expression))),
      optional(seq($._for_keyword, field("for_length", $._expression))),
      $._to_keyword,
      $.__copy_lob_target,
      optional(
        choice(
          alias(kw("NO-CONVERT"), $.no_convert),
          alias($.__copy_lob_convert_phrase, $.convert_phrase),
        ),
      ),
    ),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __copy_lob_source: ($) =>
    choice(
      seq(optional($._kw_object), field("source", $._expression)),
      seq(kw("FILE"), field("source_file", $._expression)),
    ),

  // oxlint-disable-next-line tree-sitter-optimize/single-use-choice
  __copy_lob_target: ($) =>
    choice(
      seq(optional($._kw_object), field("target", $._expression), optional($.__copy_lob_overlay)),
      seq(kw("FILE"), field("target_file", $._expression), optional(alias(kw("APPEND"), $.append))),
    ),

  __copy_lob_overlay: ($) =>
    seq(
      kw("OVERLAY"),
      $._at_keyword,
      field("overlay_at", $._expression),
      optional(alias(kw("TRIM"), $.trim)),
    ),

  __copy_lob_convert_phrase: ($) =>
    // oxlint-disable-next-line tree-sitter-optimize/non-empty-tail-extraction
    seq(
      kw("CONVERT"),
      optional(seq($._kw_source, $._kw_codepage, field("source_codepage", $._expression))),
      optional(seq($._kw_target, $._kw_codepage, field("target_codepage", $._expression))),
    ),
});
