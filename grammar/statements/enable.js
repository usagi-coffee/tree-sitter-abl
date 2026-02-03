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
        field("field", $._identifier_or_qualified_name),
        repeat($.format_phrase),
        optional(seq(kw("WHEN"), field("when", $._expression))),
      ),
      seq(
        kw("TEXT"),
        "(",
        token(/[A-Za-z_][A-Za-z0-9_-]*/),
        $.format_phrase,
        ")",
      ),
      seq(field("constant", $.string_literal), repeat($.format_phrase)),
      kw("SKIP"),
    ),
});
