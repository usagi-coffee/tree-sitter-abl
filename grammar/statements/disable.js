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
        field("field", choice($.identifier, $.qualified_name)),
        repeat($.format_phrase),
        optional(seq(kw("WHEN"), field("when", $._expression))),
      ),
      seq(
        kw("TEXT"),
        "(",
        token(/[A-Za-z_][A-Za-z0-9_-]*/),
        repeat($.format_phrase),
        ")",
      ),
      seq(field("constant", $.__disable_constant), repeat($.format_phrase)),
      kw("SKIP"),
    ),

  __disable_constant: ($) => $.string_literal,
});
