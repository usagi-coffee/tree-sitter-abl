export default ({ kw }) => ({
  disable_statement: ($) => seq(kw("DISABLE"), $.__disable_body, $._terminator),

  __disable_body: ($) =>
    seq(
      optional(alias(kw("UNLESS-HIDDEN"), $.unless_hidden)),
      $.__disable_items,
      optional($.frame_phrase),
    ),
  __disable_items: ($) =>
    choice(
      seq(alias(kw("ALL"), $.all), optional($._except_fields)),
      repeat1(alias($.__disable_item, $.disable_item)),
    ),

  __disable_item: ($) =>
    choice(
      seq(
        field("field", $._identifier_or_array_access),
        repeat($.format_phrase),
        optional($._when_phrase),
      ),
      seq(kw("TEXT"), "(", token(/[A-Za-z_][A-Za-z0-9_-]*/), repeat($.format_phrase), ")"),
      seq(field("constant", $.string_literal), repeat($.format_phrase)),
      alias(kw("SKIP"), $.skip),
    ),
});
