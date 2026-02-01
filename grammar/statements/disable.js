module.exports = ({ kw }) => ({
  disable_statement: ($) => seq(kw("DISABLE"), $.__disable_body, $._terminator),

  __disable_body: ($) =>
    seq(
      optional(kw("UNLESS-HIDDEN")),
      choice(
        seq(
          kw("ALL"),
          optional(seq(kw("EXCEPT"), repeat1(field("except", $.identifier)))),
        ),
        repeat1(alias($.__disable_item, $.disable_item)),
      ),
      optional($.frame_phrase),
    ),
  __disable_item: ($) =>
    choice(
      seq(
        field("field", $._expression),
        optional($.format_phrase),
        optional(seq(kw("WHEN"), field("when", $._expression))),
      ),
      seq(
        kw("TEXT"),
        "(",
        token(/[A-Za-z_][A-Za-z0-9_-]*/),
        optional($.format_phrase),
        ")",
      ),
      seq(
        field("constant", $.string_literal),
        choice(
          alias($.__disable_at_phrase, $.at_phrase),
          alias($.__disable_constant_option, $.constant_option),
        ),
        repeat(alias($.__disable_constant_option, $.constant_option)),
      ),
      kw("SKIP"),
    ),
  __disable_at_phrase: ($) => seq(kw("AT"), token(/[0-9]+(\.[0-9]+)?/)),
  __disable_constant_option: ($) =>
    choice(
      seq(kw("BGCOLOR"), token(/[0-9]+(\.[0-9]+)?/)),
      seq(kw("VIEW-AS"), kw("TEXT")),
    ),
});
