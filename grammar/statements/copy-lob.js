module.exports = ({ kw, tkw }) => ({
  copy_lob_statement: ($) =>
    seq(kw("COPY-LOB"), $.__copy_lob_body, $._terminator),
  __copy_lob_body: ($) =>
    seq(
      optional(kw("FROM")),
      choice(
        seq(optional(tkw("OBJECT")), field("source", $._expression)),
        seq(tkw("FILE"), field("source_file", $._expression)),
      ),
      optional(seq(kw("STARTING"), tkw("AT"), field("starting_at", $._expression))),
      optional(seq(tkw("FOR"), field("for_length", $._expression))),
      kw("TO"),
      choice(
        seq(
          optional(tkw("OBJECT")),
          field("target", $._expression),
          optional(
            seq(
              kw("OVERLAY"),
              tkw("AT"),
              field("overlay_at", $._expression),
              optional(tkw("TRIM")),
            ),
          ),
        ),
        seq(
          tkw("FILE"),
          field("target_file", $._expression),
          optional(tkw("APPEND")),
        ),
      ),
      optional(
        choice(
          tkw("NO-CONVERT"),
          alias($.__copy_lob_convert_phrase, $.convert_phrase),
        ),
      ),
      optional(tkw("NO-ERROR")),
    ),

  __copy_lob_convert_phrase: ($) =>
    seq(
      tkw("CONVERT"),
      optional(seq(kw("SOURCE"), kw("CODEPAGE"), field("source_codepage", $._expression))),
      optional(seq(kw("TARGET"), kw("CODEPAGE"), field("target_codepage", $._expression))),
    ),
});
