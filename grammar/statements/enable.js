export default ({ kw }) => ({
  enable_statement: ($) => seq($.__enable_prefix, $._terminator),

  // With no field list at all the statement realizes the frame and enables
  // nothing -- `ENABLE WITH FRAME F1 VIEW-AS DIALOG-BOX.` -- so the frame
  // phrase stands in for the list rather than the list being optional; a bare
  // ENABLE with neither has no meaning.
  __enable_prefix: ($) =>
    seq(
      kw("ENABLE"),
      optional(alias(kw("UNLESS-HIDDEN"), $.unless_hidden)),
      choice(
        seq($.__enable_body, optional($.in_window_phrase), optional($.frame_phrase)),
        seq(optional($.in_window_phrase), $.frame_phrase),
      ),
    ),
  __enable_body: ($) =>
    choice(
      seq(
        alias(kw("ALL"), $.all),
        optional(seq(kw("EXCEPT"), repeat1(field("except", $._identifier_or_qualified_name)))),
      ),
      repeat1(alias($.__enable_item, $.enable_item)),
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
