module.exports = ({ kw }) => ({
  enable_statement: ($) => seq($.__enable_prefix, $._terminator),

  __enable_prefix: ($) =>
    seq(
      kw("ENABLE"),
      optional(alias(kw("UNLESS-HIDDEN"), $.unless_hidden)),
      choice(
        seq(
          alias(kw("ALL"), $.all),
          optional(seq(kw("EXCEPT"), repeat1(field("except", $._identifier_or_qualified_name)))),
        ),
        repeat1(alias($.__enable_item, $.enable_item)),
      ),
      optional($.in_window_phrase),
      optional($.frame_phrase),
    ),

  __enable_item: ($) =>
    choice(
      seq(
        field("field", $._identifier_or_array_access),
        repeat($.format_phrase),
        optional($._when_phrase),
      ),
      seq(kw("TEXT"), "(", token(/[A-Za-z_][A-Za-z0-9_-]*/), $.format_phrase, ")"),
      seq(field("constant", $.string_literal), repeat($.format_phrase)),
      alias(kw("SKIP"), $.skip),
    ),
});
