module.exports = ({ kw }) => ({
  copy_lob_statement: ($) => seq(kw("COPY-LOB"), $.__copy_lob_body, $._no_error_terminator),

  __copy_lob_body: ($) =>
    seq(
      optional(kw("FROM")),
      $.__copy_lob_source,
      optional(seq(kw("STARTING"), kw("AT"), field("starting_at", $._expression))),
      optional(seq(kw("FOR"), field("for_length", $._expression))),
      kw("TO"),
      $.__copy_lob_target,
      optional(
        choice(
          alias(kw("NO-CONVERT"), $.no_convert),
          alias($.__copy_lob_convert_phrase, $.convert_phrase),
        ),
      ),
    ),

  __copy_lob_source: ($) =>
    choice(
      seq(optional(kw("OBJECT")), field("source", $._expression)),
      seq(kw("FILE"), field("source_file", $._expression)),
    ),

  __copy_lob_target: ($) =>
    choice(
      seq(
        optional(kw("OBJECT")),
        field("target", $._expression),
        optional(
          seq(
            kw("OVERLAY"),
            kw("AT"),
            field("overlay_at", $._expression),
            optional(alias(kw("TRIM"), $.trim)),
          ),
        ),
      ),
      seq(kw("FILE"), field("target_file", $._expression), optional(alias(kw("APPEND"), $.append))),
    ),

  __copy_lob_convert_phrase: ($) =>
    seq(
      kw("CONVERT"),
      optional(seq(kw("SOURCE"), kw("CODEPAGE"), field("source_codepage", $._expression))),
      optional(seq(kw("TARGET"), kw("CODEPAGE"), field("target_codepage", $._expression))),
    ),
});
