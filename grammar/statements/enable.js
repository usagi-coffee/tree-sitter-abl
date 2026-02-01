module.exports = ({ kw }) => ({
  enable_statement: ($) => seq(kw("ENABLE"), $.__enable_body, $._terminator),
  __enable_body: ($) =>
    seq(
      optional(kw("UNLESS-HIDDEN")),
      choice(
        seq(
          kw("ALL"),
          optional(seq(kw("EXCEPT"), repeat1(field("except", $.identifier)))),
        ),
        repeat1(alias($.__enable_item, $.enable_item)),
      ),
      optional(seq(kw("IN"), kw("WINDOW"), field("window", $._expression))),
      optional($.frame_phrase),
    ),
  __enable_item: ($) =>
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
        $.format_phrase,
        ")",
      ),
      seq(
        field("constant", $.string_literal),
        choice(
          alias($.__enable_at_phrase, $.at_phrase),
          alias($.__enable_constant_option, $.constant_option),
        ),
        repeat(alias($.__enable_constant_option, $.constant_option)),
      ),
      kw("SKIP"),
    ),
  __enable_at_phrase: ($) => seq(kw("AT"), token(/[0-9]+(\.[0-9]+)?/)),
  __enable_constant_option: ($) =>
    choice(
      seq(kw("BGCOLOR"), token(/[0-9]+(\.[0-9]+)?/)),
      seq(kw("VIEW-AS"), kw("TEXT")),
    ),
});
