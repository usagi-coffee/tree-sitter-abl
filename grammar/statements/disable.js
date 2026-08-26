export default ({ kw }) => ({
  disable_statement: ($) => seq(kw("DISABLE"), optional($.__disable_body), $._terminator),

  __disable_body: ($) =>
    seq(
      optional(alias(kw("UNLESS-HIDDEN"), $.unless_hidden)),
      $.__disable_items,
      optional($.frame_phrase),
    ),
  __disable_items: ($) =>
    choice(seq(alias(kw("ALL"), $.all), optional($._except_fields)), $.__disable_items_list),
  __disable_items_list: ($) =>
    prec.right(seq(alias($.__disable_item, $.disable_item), optional($.__disable_items_list))),

  __disable_item: ($) =>
    choice(
      seq(
        field("field", $._identifier_or_array_access),
        optional($._format_phrases),
        optional($._when_phrase),
      ),
      seq(kw("TEXT"), "(", token(/[A-Za-z_][A-Za-z0-9_-]*/), optional($._format_phrases), ")"),
      seq(field("constant", $.string_literal), optional($._format_phrases)),
      alias(kw("SKIP"), $.skip),
    ),
});
