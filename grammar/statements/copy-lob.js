module.exports = ({ kw }) => ({
  copy_lob_statement: ($) =>
    seq(kw("COPY-LOB"), $.__copy_lob_body, $._terminator),
  __copy_lob_body: ($) =>
    seq(
      optional(kw("FROM")),
      choice(
        seq(optional(kw("OBJECT")), field("source", $._expression)),
        seq(kw("FILE"), field("source_file", $._expression)),
      ),
      optional(
        seq(kw("STARTING"), kw("AT"), field("starting_at", $._expression)),
      ),
      optional(seq(kw("FOR"), field("for_length", $._expression))),
      kw("TO"),
      choice(
        seq(
          optional(kw("OBJECT")),
          field("target", $._expression),
          optional(
            seq(
              kw("OVERLAY"),
              kw("AT"),
              field("overlay_at", $._expression),
              optional(kw("TRIM")),
            ),
          ),
        ),
        seq(
          kw("FILE"),
          field("target_file", $._expression),
          optional(kw("APPEND")),
        ),
      ),
      optional(
        choice(
          kw("NO-CONVERT"),
          alias($.__copy_lob_convert_phrase, $.convert_phrase),
        ),
      ),
      optional(kw("NO-ERROR")),
    ),

  __copy_lob_convert_phrase: ($) =>
    seq(
      kw("CONVERT"),
      optional(
        seq(
          kw("SOURCE"),
          kw("CODEPAGE"),
          field("source_codepage", $._expression),
        ),
      ),
      optional(
        seq(
          kw("TARGET"),
          kw("CODEPAGE"),
          field("target_codepage", $._expression),
        ),
      ),
    ),
});
