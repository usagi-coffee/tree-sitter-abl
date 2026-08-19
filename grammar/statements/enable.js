export default ({ kw }) => ({
  enable_statement: ($) => seq($.__enable_prefix, $._terminator),

  // With no field list at all the statement realizes the frame and enables
  // nothing -- `ENABLE WITH FRAME F1 VIEW-AS DIALOG-BOX.`
  //
  // `ENABLE.` on its own compiles too. An earlier reading of this rule refused
  // it on the grounds that it has no meaning, which is a statement about what
  // the program does rather than about what the compiler accepts; generated
  // code emits it when the list it was going to write came from a macro that
  // expanded to nothing, exactly as it does for a bare ASSIGN.
  __enable_prefix: ($) =>
    seq(
      kw("ENABLE"),
      optional(alias(kw("UNLESS-HIDDEN"), $.unless_hidden)),
      optional(
        choice(
          seq($.__enable_body, optional($.in_window_phrase), optional($.frame_phrase)),
          seq(optional($.in_window_phrase), $.frame_phrase),
        ),
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
